const _ = require('lodash');
const nlp = require('compromise');
const readline = require('readline');
const { lexicon } = require('./enums');
const sentenceTemplates = require('./templates');

/**
 * Parses a given string
 * @param {{sentence: string}} input input string
 * @returns {any[]} array of matching cases
 */
const parse = ({ sentence }) => {
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
      parameters: template.getParams(match, sentence),
    }))
    .value();
};

if (process.argv.includes('-i')) {
  // interactive mode on
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = () => rl.question('Input sentence (or \'exit\')\n> ',
    (answer) => {
      if (answer === 'exit') {
        rl.close();
      } else {
        // eslint-disable-next-line no-console
        console.log('Output:\n', parse({ sentence: answer }));
        ask();
      }
    });
  ask();
}

module.exports = {
  parse,
};
