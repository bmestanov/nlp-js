const _ = require('lodash');
const { expect } = require('chai');
const { parse } = require('../parser');

/**
   * Helper function
   * @param {string} sentence sentence to be tested
   * @param {[any]} output desired output
   * @param {{string: any}} parseArgs arguments forwarded to parser
   * @param {Boolean} strict expect the output to be the best match
   */
const check = async (sentence, output, parseArgs, strict = true) => {
  const result = await parse({ sentence, ...parseArgs });
  const omittedScore = _.map(result, template => _.omit(template, 'score'));
  const intersect = _.intersectionWith(output, omittedScore, _.isEqual);
  // eslint-disable-next-line no-unused-expressions
  expect(intersect).to.not.be.empty;
  if (strict) {
    expect(omittedScore[0]).to.deep.equal(output[0]);
  }
  return _.isEqual(omittedScore[0], output[0]);
};

module.exports = {
  check,
};
