const _ = require('lodash');
const sentenceTemplates = require('./templates');
const { SentenceScorer } = require('./sentence-scorer');

/**
 * Parses a given string
 * @typedef {'en' | 'en_GB' | 'de' | 'fr' | 'es' | 'ja'} Locale
 * @param {{sentence: string, locale: Locale }} input input string
 * @returns {any[]} array of matching cases
 */
const parse = async ({ sentence, locale = 'en' }) => SentenceScorer
  .getInstance()
  .then(({ score }) => score(sentence))
  .then(matches => _(matches)
    .map(({ label, score }) => ({
      statement: sentenceTemplates[label].statement,
      sentenceTemplate: sentenceTemplates[label].text,
      parameters: sentenceTemplates[label].getParams(sentence, locale),
      score,
    }))
    .value())
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    return [];
  });

module.exports = {
  parse,
};
