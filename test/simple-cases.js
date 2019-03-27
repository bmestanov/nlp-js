const { describe, it } = require('mocha');
const { expect } = require('chai');
const { parse } = require('../parser');
const { enums } = require('../enums');
const sentenceTemplates = require('../templates');

describe('simple cases', () => {
  /**
   * Helper function
   * @param {string} sentence sentence to be tested
   * @param {[any]} output desired output
   */
  const check = (sentence, output) => {
    const result = parse({ sentence });
    expect(result).to.deep.equal(output);
  };

  it('property is greater than int', () => {
    check('quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('int is greater than property', () => {
    check('10 is greater than quantity', [{
      statement: enums.statements.gt,
      parameters: [10, 'quantity'],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than float', () => {
    check('quantity is greater than 10.01', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10.01],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('if property is greater than int ', () => {
    check('if quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('if the property is greater than int ', () => {
    check('if the quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('when property is greater than int ', () => {
    check('when quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('when the property is greater than int ', () => {
    check('when the quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than spelled int', () => {
    check('quantity is greater than ten', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('undefined property returns empty match', () => {
    check('depth is greater 88', []);
  });

  it('property greater than property', () => {
    check('quantity is greater than part number', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 'part number'],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property less than int', () => {
    check('quantity is less than 10', [{
      statement: enums.statements.lt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });

  it('property equals int', () => {
    check('quantity equals 10', [{
      statement: enums.statements.eq,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.eq.text,
    }]);
  });

  it('property is not equal to int', () => {
    check('quantity is not equal to 10', [{
      statement: enums.statements.neq,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.neq.text,
    }]);
  });

  it('int is not equal to property', () => {
    check('10 is not equal to quantity', [{
      statement: enums.statements.neq,
      parameters: [10, 'quantity'],
      sentenceTemplate: sentenceTemplates.neq.text,
    }]);
  });

  it('should ignore punctuation', () => {
    check('part number, is-less-than 10.', [{
      statement: enums.statements.lt,
      parameters: ['part number', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });

  it.only('should ignore letter casing', () => {
    check('Part number IS LESS THAN 10', [{
      statement: enums.statements.lt,
      parameters: ['part number', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });
});
