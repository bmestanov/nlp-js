const { describe, it } = require('mocha');
const { enums } = require('../enums');
const { check } = require('./lib');
const sentenceTemplates = require('../templates');

describe('complex cases', () => {
  it('sentence includes tag', async () => {
    await check('quantity is bigger than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('sentence includes variation of a tag (high -> higher)', async () => {
    await check('quantity is higher than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('sentence includes variation of a tag (less -> lesser)', async () => {
    await check('quantity is lesser than 10', [{
      statement: enums.statements.lt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });

  it('sentence includes synonym of a tag', async () => {
    await check('quantity is better than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });
});
