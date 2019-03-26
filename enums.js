/* eslint-disable quote-props */
const _ = require('lodash');

const enums = {
  statements: {
    gt: 'greaterThan',
    lt: 'lessThan',
    eq: 'equals',
    neq: 'notEquals',
    before: 'before',
    after: 'after',
  },
  objects: [
    {
      object: 'purchase order',
      properties: ['part number', 'quantity', 'unit price'],
    },
  ],
};

const lexicon = _.chain(enums)
  .get('objects')
  .flatMap('properties')
  .reduce((acc, curr) => {
    acc[curr] = 'Property';
    return acc;
  }, {})
  .value();

module.exports = {
  enums,
  lexicon,
};
