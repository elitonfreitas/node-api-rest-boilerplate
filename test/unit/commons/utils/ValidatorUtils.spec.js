'use strict';

const TestBase = require('../../TestBase');

class ValidatorUtilsTest extends TestBase {
  constructor() {
    super('../../src/commons/utils/ValidatorUtils');
  }

  test() {
    it('should check if variable is an object', () => {
      expect(this.controller.isOjbect({})).toBe(true);
    });

    it('should check if variable not is an object', () => {
      expect(this.controller.isOjbect('test')).toBe(false);
    });

    it('should check if variable is a number', () => {
      expect(this.controller.isNumber(1)).toBe(true);
    });

    it('should check if variable not is a number', () => {
      expect(this.controller.isNumber('test')).toBe(false);
    });

    it('should check if variable is undefined', () => {
      expect(this.controller.isNumber()).toBe(false);
    });
  }
}

new ValidatorUtilsTest().run();
