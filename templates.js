const _ = require('lodash');
const moment = require('moment');
const chrono = require('chrono-node');
const nlp = require('compromise');
const { enums, lexicon } = require('./enums');

const refiner = new chrono.Refiner();
refiner.refine = (text, results) => {
  results.forEach((result) => {
    if (!result.start.isCertain('meridiem')) {
      result.start.assign('meridiem', 0);
    }
    if (!result.start.isCertain('hour')) {
      result.start.assign('hour', 0);
    }
  });
  return results;
};

const dateParser = new chrono.Chrono();
dateParser.refiners.push(refiner);

/**
 * Finds properties from the lexicon and inserts already found values,
 * maintaining the original order.
 * @param {string} sentence normalized input sentence
 * @param {[{index: number, entry: any}]} values extracted values
 */
const withProperties = (sentence, values) => _(lexicon)
  .keys()
  .map(entry => ({ entry, index: sentence.indexOf(entry) }))
  .filter(({ index }) => index >= 0)
  .tap(entries => entries.push(...values))
  .sortBy('index')
  .map('entry')
  .value();

/**
 * Helper function
 * @param {Text} match compromise match result
 * @param {string} sentence original sentence to be matched
 * @returns {[any]} array of parameters: properties and numbers
 */
const getNumberParams = (match, sentence) => {
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

  return withProperties(normalized, values);
};

const getDateParams = (match, sentence) => {
  const normalized = nlp(sentence).normalize().out();
  const values = dateParser.parse(normalized)
    .map(({ index, start }) => ({
      entry: moment(start.date()).toString(),
      index,
    }));

  return withProperties(normalized, values);
};

module.exports = {
  gt: {
    text: 'x is greater than y',
    matcher: '(#Property|#Value)+ is greater than (#Property|#Value)+',
    statement: enums.statements.gt,
    getParams: getNumberParams,
  },
  lt: {
    text: 'x is less than y',
    matcher: '(#Property|#Value)+ is less than (#Property|#Value)+',
    statement: enums.statements.lt,
    getParams: getNumberParams,
  },
  eq: {
    text: 'x equals y',
    matcher: '(#Property|#Value)+ equals (#Property|#Value)+',
    statement: enums.statements.eq,
    getParams: getNumberParams,
  },
  neq: {
    text: 'x is not equal to y',
    matcher: '(#Property|#Value)+ is not equal to (#Property|#Value)+',
    statement: enums.statements.neq,
    getParams: getNumberParams,
  },
  before: {
    text: 'x is before y',
    matcher: '(#Property|#Date)+ is before (#Property|#Date)+',
    statement: enums.statements.before,
    getParams: getDateParams,
  },
  after: {
    text: 'x is after y',
    matcher: '(#Property|#Date)+ is after (#Property|#Date)+',
    statement: enums.statements.after,
    getParams: getDateParams,
  },
};
