'use strict';

const jwt = require('jsonwebtoken');
const md5 = require('md5');
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

      this.expectedErrorResponse.message = [this.Messages.INVALID_TOKEN];

      this.controller._checkRequestToken(this.req, this.res, () => {});
      expect(this.status.calledWith(this.HttpStatusCode.UNAUTHORIZED)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should process check route with invalid origin', async () => {
      this.req.originalUrl = 'http://localhost:3030/api/users';
      this.req.method = 'PUT';
      const tokenData = { user: { _id: '123', name: 'Test' } };
      const token = jwt.sign(tokenData, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_DURATION,
        algorithm: process.env.JWT_ALGORITHM,
      });
      this.req.headers.authorization = `Bearer ${token}`;
      this.req.ip = '1234';

      this.expectedErrorResponse.message = [this.Messages.INVALID_TOKEN_ORIGIN];

      this.controller._checkRequestToken(this.req, this.res, () => {});
      expect(this.status.calledWith(this.HttpStatusCode.NOT_ACCEPTABLE)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should process check route with valid token', async () => {
      this.req.originalUrl = 'http://localhost:3030/api/users';
      this.req.method = 'PUT';
      this.req.headers['user-agent'] = 'Test';
      this.req.ip = '123';
      const jti = md5(this.req.ip + this.req.header('user-agent'));
      const tokenData = { user: { _id: '123', name: 'Test' }, jti };
      const token = jwt.sign(tokenData, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_DURATION,
        algorithm: process.env.JWT_ALGORITHM,
      });
      this.req.headers.authorization = `Bearer ${token}`;

      this.controller._checkRequestToken(this.req, this.res, () => {
        expect(this.req.token.user).toBe(tokenData.user);
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
