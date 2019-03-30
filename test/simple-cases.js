const _ = require('lodash');
const moment = require('moment');
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
   * @param {{string: any}} parseArgs arguments forwarded to parser
   */
  const check = async (sentence, output, parseArgs) => {
    const result = await parse({ sentence, ...parseArgs });
    const omittedScore = _.map(result, template => _.omit(template, 'score'));
    const intersect = _.intersectionWith(output, omittedScore, _.isEqual);
    // eslint-disable-next-line no-unused-expressions
    expect(intersect).to.not.be.empty;
  };

  it('property is greater than int', async () => {
    await check('quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('int is greater than property', async () => {
    await check('10 is greater than quantity', [{
      statement: enums.statements.gt,
      parameters: [10, 'quantity'],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than float', async () => {
    await check('quantity is greater than 10.01', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10.01],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('if property is greater than int ', async () => {
    await check('if quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('if the property is greater than int ', async () => {
    await check('if the quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('when property is greater than int ', async () => {
    await check('when quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('when the property is greater than int ', async () => {
    await check('when the quantity is greater than 10', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than spelled int', async () => {
    await check('quantity is greater than ten', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('undefined property is ignored', async () => {
    await check('depth is greater 88', [{
      statement: enums.statements.gt,
      parameters: [88],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property greater than property', async () => {
    await check('quantity is greater than part number', [{
      statement: enums.statements.gt,
      parameters: ['quantity', 'part number'],
      sentenceTemplate: sentenceTemplates.gt.text,
    }]);
  });

  it('property less than int', async () => {
    await check('quantity is less than 10', [{
      statement: enums.statements.lt,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });

  it('property equals int', async () => {
    await check('quantity equals 10', [{
      statement: enums.statements.eq,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.eq.text,
    }]);
  });

  it('property is not equal to int', async () => {
    await check('quantity is not equal to 10', [{
      statement: enums.statements.neq,
      parameters: ['quantity', 10],
      sentenceTemplate: sentenceTemplates.neq.text,
    }]);
  });

  it('int is not equal to property', async () => {
    await check('10 is not equal to quantity', [{
      statement: enums.statements.neq,
      parameters: [10, 'quantity'],
      sentenceTemplate: sentenceTemplates.neq.text,
    }]);
  });

  it('should ignore punctuation', async () => {
    await check('part number, is-less-than 10.', [{
      statement: enums.statements.lt,
      parameters: ['part number', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });

  it('should ignore letter casing', async () => {
    await check('Part number IS LESS THAN 10', [{
      statement: enums.statements.lt,
      parameters: ['part number', 10],
      sentenceTemplate: sentenceTemplates.lt.text,
    }]);
  });

  it('property is after date', async () => {
    await check('order date is after 3rd December, 2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-12-03').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('date is after property', async () => {
    await check('3rd December, 2019 is after order date', [{
      statement: enums.statements.after,
      parameters: [moment('2019-12-03').toString(), 'order date'],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('property is after time', async () => {
    await check('order date is after 11AM 3rd December 2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-12-03T11:00').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('property is after spelled date', async () => {
    await check('order date is after third of December 2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-12-03').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('property is after short time', async () => {
    await check('order date is after 3 Dec 2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-12-03').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('property is after US dates with slash', async () => {
    await check('order date is after 12/03/2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-12-03').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('property is after US dates with dots', async () => {
    await check('order date is after 12.03.2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-12-03').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('property is after UK date with slash', async () => {
    await check('order date is after 12/03/2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-03-12').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }], { locale: 'en_GB' });
  });

  it('property is after german date with dots', async () => {
    await check('order date is after 12.03.2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-03-12').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }], { locale: 'de' });
  });

  it('property is after month', async () => {
    await check('order date is after December 2019', [{
      statement: enums.statements.after,
      parameters: ['order date', moment('2019-12-01').toString()],
      sentenceTemplate: sentenceTemplates.after.text,
    }]);
  });

  it('property is before time', async () => {
    await check('order date is before 11:24AM Dec 03 2019', [{
      statement: enums.statements.before,
      parameters: ['order date', moment('2019-12-03T11:24').toString()],
      sentenceTemplate: sentenceTemplates.before.text,
    }]);
  });
});
