const { enums } = require('./enums');
const { getNumberParams, getDateParams } = require('./lib');

module.exports = {
  gt: {
    label: 'gt',
    text: 'x is greater than y',
    statement: enums.statements.gt,
    getParams: getNumberParams,
    tags: ['big', 'bigger', 'more', 'great', 'greater', 'high', 'higher', 'beyond', 'over'],
  },
  lt: {
    label: 'lt',
    text: 'x is less than y',
    statement: enums.statements.lt,
    getParams: getNumberParams,
    tags: ['small', 'smaller', 'less', 'lesser', 'fewer', 'low', 'lower', 'below', 'under'],
  },
  eq: {
    label: 'eq',
    text: 'x equals y',
    statement: enums.statements.eq,
    getParams: getNumberParams,
    tags: ['same', 'as', 'like', 'equal', 'equals', 'near', 'in', 'around'],
  },
  neq: {
    label: 'neq',
    text: 'x is not equal to y',
    statement: enums.statements.neq,
    getParams: getNumberParams,
    tags: ['not', 'equal', 'unequal', 'unlike', 'different'],
  },
  before: {
    label: 'before',
    text: 'x is before y',
    statement: enums.statements.before,
    getParams: getDateParams,
    tags: ['before', 'prior', 'pre', 'previous', 'early', 'earlier'],
  },
  after: {
    label: 'after',
    text: 'x is after y',
    statement: enums.statements.after,
    getParams: getDateParams,
    tags: ['after', 'post', 'early', 'earlier'],
  },
};
