/* eslint-disable no-console */
require('dotenv').config();
const w2v = require('word2vec');
const dnode = require('dnode');
const _ = require('lodash');
const nlp = require('compromise');
const { lexicon } = require('./enums');
const sentenceTemplates = require('./templates');

const calculateScores = (statement, model) => {
  // take out the base terms from the original sentence
  // exclude values and properties to reduce noise
  const terms = [...new Set(
    nlp(statement, lexicon)
      .normalize()
      .match('!#Property')
      .match('!#Copula')
      .match('(#Adjective|#Noun|#Verb|#Negative|#Preposition)')
      .terms()
      .out('array')
      .map(term => term.toLowerCase()),
  )];
  // scores is a 3D array
  // with axes templates, tags, terms
  const scores = _(sentenceTemplates)
    .map((template) => {
      // tagSimilarities is a 2D array
      // with axes tags and terms
      const { tags } = template;
      const tagSimilarities = _(tags)
        .map(tag => terms
          .map(term => ({
            tag,
            term,
            // boost exact matches by squaring others
            // row score above 1 means that there was an exact match
            similarity: model.similarity(tag, term) ** 2,
          })));
      return {
        label: template.label,
        tagSimilarities: tagSimilarities.value(),
        score: tagSimilarities
          .map(row => _(row).map('similarity').sum()).sum() / terms.length, // normalize
      };
    })
    .sortBy('score')
    .reverse()
    .take(3)
    .value();
  return scores;
};

const tic = Date.now();
console.log(`word2vec server started ${new Date()}`);
console.log('Loading word vectors...');
w2v.loadModel(process.env.WORD2VEC_BIN_PATH, (err, model) => {
  const toc = Date.now();
  const port = process.env.WORD2VEC_SERVER_PORT;
  const server = dnode({
    getScores: (sentence, cb) => {
      try {
        cb(null, calculateScores(sentence, model));
      } catch (calculationError) {
        cb(calculationError);
      }
    },
  });
  server.listen(port);
  console.log(`Imported model ${(toc - tic) / 1000}s`);
  console.log('Listening on port', port);
});
