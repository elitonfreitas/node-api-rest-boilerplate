'use strict';

const jwt = require('jsonwebtoken');
const { toLength } = require('lodash');
const TestBase = require('test/unit/TestBase');

class JwtMiddlewareTest extends TestBase {
  constructor() {
    super('src/commons/middlewares/JwtMiddleware', false, false);
  }

  test() {
    it('should process check route without token', done => {
      this.req.originalUrl = 'http://localhost:3030/api/auth';
      this.req.method = 'POST';

      this.controller.process(this.req, this.res, () => {});
      done();
    });

    it('should process check route with token', done => {
      this.req.originalUrl = 'http://localhost:3030/api/users';
      this.req.method = 'PUT';

      this.controller.process(this.req, this.res, () => {});
      done();
    });

    it('should process check route with invalid token', async () => {
      this.req.originalUrl = 'http://localhost:3030/api/users';
      this.req.method = 'PUT';

      this.expectedErrorResponse.message = this.Messages.INVALID_TOKEN;

      this.controller._checkRequestToken(this.req, this.res, () => {});
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should process check route with valid token', async () => {
      this.req.originalUrl = 'http://localhost:3030/api/users';
      this.req.method = 'PUT';
      const tokenData = { data: { _id: '123', name: 'Test' } };
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURATION });
      this.req.headers.authorization = `Bearer ${token}`;

      this.controller._checkRequestToken(this.req, this.res, () => {
        expect(this.req.token.data).toBe(tokenData).data;
      });
    });

    it('should process next route', async () => {
      this.req.originalUrl = 'http://localhost:3030/api/auth';
      this.req.method = 'POST';
      this.req.token = true;

      this.controller.nextIfHasToken(this.req, this.res, () => {});
    });
  }
}

new JwtMiddlewareTest().run();
