const _ = require('lodash');
const nlp = require('compromise');
const { lexicon } = require('./enums');
const sentenceTemplates = require('./templates');

/**
 * Parses a given string
 * @param {String} input - input string
 * @returns {Array} res - array of matching cases
 */
exports.parse = ({ sentence }) => {
  const tokens = nlp(sentence, lexicon);
  return _(sentenceTemplates)
    .map((template) => {
      const { matcher } = template;
      const match = tokens.match(matcher);
      return { template, match };
    })
    .filter('match.found')
    .map(({ template, match }) => ({
      statement: template.statement,
      sentenceTemplate: template.text,
      parameters: template.getParams(match),
    }))
    .value();
};
