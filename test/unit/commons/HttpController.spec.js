'use strict';

const TestBase = require('../TestBase');

class HttpControllerTest extends TestBase {
  constructor() {
    super('../../src/commons/HttpController', false, true);
  }

  test() {
    it('should call options method', () => {
      this.expectedResponse = {
        message: '',
        data: {}
      };
      this.controller.options(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });
  }
}

new HttpControllerTest().run();
