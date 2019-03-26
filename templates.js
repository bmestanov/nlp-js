const { enums } = require('./enums');

/**
 * Helper function
 * @param {Text} match compromise match result
 * @returns {Array} array of parameters: properties and numbers
 */
const getValueParams = match => match
  .terms()
  .if('(#Property|#Value)') // filter only properties and values
  .reduce((terms, term) => {
    if (term.has('#Property')) {
      // if the term contains a property, add its identifier to the param list
      return [...terms, term.normalize().out()];
    }
    // otherwise parse the values and add to the param list
    return [...terms, ...term.values().numbers()];
  }, []);

module.exports = {
  gt: {
    text: 'x is greater than y',
    matcher: '(#Property|#Value) is greater than (#Property|#Value)',
    statement: enums.statements.gt,
    getParams: getValueParams,
  },
  lt: {
    text: 'x is less than y',
    matcher: '(#Property|#Value) is less than (#Property|#Value)',
    statement: enums.statements.lt,
    getParams: getValueParams,
  },
  eq: {
    text: 'x equals y',
    matcher: '(#Property|#Value) equals (#Property|#Value)',
    statement: enums.statements.eq,
    getParams: getValueParams,
  },
  neq: {
    text: 'x is not equal to y',
    matcher: '(#Property|#Value) is not equal to (#Property|#Value)',
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
