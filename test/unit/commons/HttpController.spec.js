'use strict';

const TestBase = require('test/unit/TestBase');

class HttpControllerTest extends TestBase {
  constructor() {
    super('src/commons/HttpController', false, true);
  }

  test() {
    it('should call options method', async () => {
      const response = await this.controller.options(this.req, this.res);
      expect(response).toStrictEqual({});
    });
  }
}

new HttpControllerTest().run();
