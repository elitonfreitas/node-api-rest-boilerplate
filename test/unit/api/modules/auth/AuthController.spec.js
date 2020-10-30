'use strict';

const TestBase = require('../../../TestBase');
const UserModel = require('../../../../../src/models/User.model');

class UserController extends TestBase {
  constructor() {
    super('../../src/api/modules/auth/controllers/AuthController', false, false);
    this.controller.User = UserModel;
  }

  test() {
    const mongoQuery = this.methods;

    it('should auth user with success', async () => {
      this.req.body = {
        email: 'user@test.com',
        password: '123456'
      };

      mongoQuery.lean = () =>
        Promise.resolve({ _id: 1, name: 'Test', password: '$2a$10$TIs5iz0OlMHPfyOe5BtS5ezr7UVABYygB5/eG3wsZB0.fj/b.yXIK' });

      this.stub(this.controller.User, 'findOne').returns(mongoQuery);
      this.restore(this.controller.User.findOne);

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
    });

    it('should not auth user with empty login', async () => {
      mongoQuery.lean = () => Promise.resolve(null);

      this.stub(this.controller.User, 'findOne').returns(mongoQuery);

      this.expectedErrorResponse.message = this.Messages.INVALID_LOGIN;

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should not auth user with invalid password', async () => {
      this.req.body = {
        email: 'user@test.com',
        password: '1234567'
      };
      mongoQuery.lean = () =>
        Promise.resolve({ _id: 1, name: 'Test', password: '$2a$10$TIs5iz0OlMHPfyOe5BtS5ezr7UVABYygB5/eG3wsZB0.fj/b.yXIK' });

      this.stub(this.controller.User, 'findOne').returns(mongoQuery);

      this.expectedErrorResponse.message = this.Messages.INVALID_LOGIN;

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should not auth user with error', async () => {
      mongoQuery.lean = () => Promise.reject();

      this.stub(this.controller.User, 'findOne').returns(mongoQuery);

      this.expectedErrorResponse.message = this.Messages.INVALID_PARAMS;

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });
  }
}

new UserController().run();
