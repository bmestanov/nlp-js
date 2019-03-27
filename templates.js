const _ = require('lodash');
const nlp = require('compromise');
const { enums, lexicon } = require('./enums');

/**
 * Helper function
 * @param {Text} match compromise match result
 * @param {string} sentence original sentence to be matched
 * @returns {[any]} array of parameters: properties and numbers
 */
const getValueParams = (match, sentence) => {
  // Manually find properties due to a compromise issue
  // https://github.com/spencermountain/compromise/issues/408

  const valueFilter = match.terms().if('#Value');
  const raw = valueFilter.data();
  const parsed = valueFilter.values().data();
  const normalized = nlp(sentence).normalize().out();

  const values = _.zip(raw, parsed)
    .map(([{ text }, { number }]) => ({
      entry: number,
      index: normalized.indexOf(text),
    }));

  return _(lexicon)
    .keys()
    .map(entry => ({ entry, index: normalized.indexOf(entry) }))
    .filter(({ index }) => index >= 0)
    .tap(entries => entries.push(...values))
    .sortBy('index')
    .map('entry')
    .value();
};

module.exports = {
  gt: {
    text: 'x is greater than y',
    matcher: '(#Property|#Value)+ is greater than (#Property|#Value)+',
    statement: enums.statements.gt,
    getParams: getValueParams,
  },
  lt: {
    text: 'x is less than y',
    matcher: '(#Property|#Value)+ is less than (#Property|#Value)+',
    statement: enums.statements.lt,
    getParams: getValueParams,
  },
  eq: {
    text: 'x equals y',
    matcher: '(#Property|#Value)+ equals (#Property|#Value)+',
    statement: enums.statements.eq,
    getParams: getValueParams,
  },
  neq: {
    text: 'x is not equal to y',
    matcher: '(#Property|#Value)+ is not equal to (#Property|#Value)+',
    statement: enums.statements.neq,
    getParams: getValueParams,
  },
  before: {
    text: 'x is before y',
    matcher: '(#Property|#Date) is before (#Property|#Date)',
    statement: enums.statements.before,
  },
  after: {
    text: 'x is after y',
    matcher: '(#Property|#Date) is after (#Property|#Date)',
    statement: enums.statements.after,
  },
};
