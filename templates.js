const { enums } = require('./enums');
const { getNumberParams, getDateParams } = require('./lib');

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
