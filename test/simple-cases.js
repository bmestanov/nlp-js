const { describe, it } = require('mocha');
const { expect } = require('chai');
const { parse } = require('../parser');
const { enums } = require('../enums');
const sentenceTemplates = require('../templates');

describe('simple cases', () => {
  it('property greater than int', () => {
    const output = parse({
      sentence: 'quantity is greater than 10',
    });
    expect(output).to.deep.equal([{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than float', () => {
    const output = parse({
      sentence: 'quantity is greater than 10.01',
    });
    expect(output).to.deep.equal([{
      statement: enums.statements.gt,
      parameters: ['quantity', 10.01],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than spelled int', () => {
    const output = parse({
      sentence: 'quantity is greater than ten',
    });
    expect(output).to.deep.equal([{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than property', () => {
    const output = parse({
      sentence: 'quantity is greater than part number',
    });
    expect(output).to.deep.equal([{
      statement: enums.statements.gt,
      parameters: ['quantity', 'part number'],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property less than int', () => {
    const output = parse({
      sentence: 'quantity is less than 10',
    });
    expect(output).to.deep.equal([{
      statement: enums.statements.lt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });
});
