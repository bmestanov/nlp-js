/* eslint-disable no-console */
require('dotenv').config();
const w2v = require('word2vec');
const dnode = require('dnode');
const _ = require('lodash');
const ss = require('string-similarity');
const nlp = require('compromise');
const { lexicon } = require('./enums');
const sentenceTemplates = require('./templates');

const hyperParam = {
  fuzzyCoeff: 0.01,
  resultCount: 3,
};

/**
 * Mean by columns (axis 1)
 * @param {[[number]]} vectors 2D vector
 * @returns {[number]} mean vector by columns
 */
const meanVector = (vectors) => {
  const mean = new Array(vectors[0].length).fill(0);
  for (let i = 0; i < vectors[0].length; i += 1) {
    for (let j = 0; j < vectors.length; j += 1) {
      mean[i] += vectors[j][i];
    }
  }
  return _.map(mean, sum => sum / vectors.length);
};


/**
 * Calculate L2 distance to the mean vector of template tags
 * @param {[number]} src terms vector
 * @param {[number]} target mean vector of template tags
 */
const loss = (src, target) => Math.sqrt(_.sum(
  _.map(
    _.zip(src, target), ([a, b]) => (a - b) ** 2,
  ),
));

const calculateScores = async (statement, templates, model) => {
  // take out the base terms from the original sentence
  // exclude values and properties to reduce noise
  const allTags = _.flatMap(templates, 'tags');

  const terms = _(
    nlp(statement, lexicon)
      .normalize()
      .terms()
      .data(),
  )
    .filter(({ normal, tags }) => _.intersection(['Property', 'Value', 'Time', 'Date'], tags).length === 0 || allTags.includes(normal))
    .filter(({ normal, tags }) => _.intersection(['Noun', 'Adjective', 'Verb'], tags).length > 0 || allTags.includes(normal))
    .map('normal')
    .value();

  const termsVector = _.map(
    model.getVectors(
      _(terms)
        .flatten()
        .map('word')
        .map(_.toLower)
        .filter(Boolean)
        .concat(terms)
        .uniq()
        .value(),
    ),
    'values',
  );

  const termsMeanVector = meanVector(termsVector);

  const scores = _(templates)
    .map(({ label, mean, tags }) => ({
      label,
      score: loss(mean, termsMeanVector) - hyperParam.fuzzyCoeff * (_.max(
        _.map(terms, term => ss.findBestMatch(term, tags).bestMatch.rating),
      )),
    }))
    .sortBy('score')
    .take(hyperParam.resultCount)
    .value();
  return scores;
};

const tic = Date.now();
console.log(`word2vec server started ${new Date()}`);
console.log('Loading word vectors...');
w2v.loadModel(process.env.WORD2VEC_BIN_PATH, (err, model) => {
  const toc = Date.now();
  const port = process.env.WORD2VEC_SERVER_PORT;
  const templates = _.map(sentenceTemplates, template => ({
    ...template,
    mean: meanVector(_.map(model.getVectors(template.tags), 'values')),
  }));
  const server = dnode({
    getScores: (sentence, cb) => {
      calculateScores(sentence, templates, model)
        .then(scores => cb(null, scores))
        .catch(cb);
    },
  });
  server.listen(port);
  console.log(`Imported model ${(toc - tic) / 1000}s`);
  console.log('Listening on port', port);
});
