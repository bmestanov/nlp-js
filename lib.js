const _ = require('lodash');
const moment = require('moment');
const chrono = require('chrono-node');
const nlp = require('compromise');
const { enums, lexicon } = require('./enums');

const refiner = new chrono.Refiner();
refiner.refine = (text, results) => {
  results.forEach((result) => {
    // Handle ambiguous times
    if (!result.start.isCertain('meridiem')) {
      result.start.assign('meridiem', 0);
    }
    if (!result.start.isCertain('hour')) {
      result.start.assign('hour', 0);
    }
  });
  return results;
};

enums.locales.forEach(locale => chrono[locale].refiners.push(refiner));

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
 * Finds numeric values
 * @param {Text} match compromise match result
 * @param {string} sentence original sentence to be matched
 * @returns {[{index: number, entry: number}]}
 */
const getNumberParams = (sentence) => {
  const normalized = nlp(sentence).normalize();
  const normalizedSentence = normalized.out();
  const valueFilter = normalized.terms().if('#Value');
  const raw = valueFilter.data();
  const parsed = valueFilter.values().data();

  const values = _.zip(raw, parsed)
    .map(([{ text }, { number }]) => ({
      entry: number,
      index: normalizedSentence.indexOf(text),
    }));

  return withProperties(normalizedSentence, values);
};

/**
 * Finds date values
 * @param {Text} match compromise match result
 * @param {string} sentence original sentence to be matched
 * @param {string} locale locale for date matching
 * @returns {[{index: number, entry: string}]}
 */
const getDateParams = (sentence, locale) => {
  const normalized = nlp(sentence).normalize().out();
  const localizedParser = chrono[locale];
  const values = localizedParser.parse(normalized)
    .map(({ index, start }) => ({
      entry: moment(start.date()).toString(),
      index,
    }));

  return withProperties(normalized, values);
};

module.exports = {
  getNumberParams,
  getDateParams,
};
