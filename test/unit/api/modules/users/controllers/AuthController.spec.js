'use strict';

const TestBase = require('test/unit/TestBase');
const UserModel = require('src/api/modules/users/models/User.model');

class AuthControllerTest extends TestBase {
  constructor() {
    super('src/api/modules/users/controllers/AuthController', false, false, UserModel);
    this.controller.Validator = {};
  }

  test() {
    it('should create user for test', async () => {
      await new this.controller.Model({
        name: 'User jest test',
        email: 'authuser@test.com',
        password: '123456',
        level: '1',
        active: true,
        addresses: [
          {
            address: 'Rua AB',
            number: '111',
            postCode: '50234-234',
            neighborhood: 'teste',
            city: 'Recife',
            state: 'PE',
            country: 'Brasil'
          }
        ]
      }).save();
    });

    it('should auth user with success', async () => {
      this.req.body = {
        email: 'authuser@test.com',
        password: '123456'
      };

      const response = await this.controller.post(this.req);
      expect(response).toHaveProperty('token');
    });

    it('should not auth user with empty login', async () => {
      this.req.body = {};
      try {
        await this.controller.post(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.INVALID_LOGIN);
      }
    });

    it('should not auth user with invalid password', async () => {
      this.req.body = {
        email: 'authuser@test.com',
        password: '1234567'
      };
      try {
        await this.controller.post(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.INVALID_LOGIN);
      }
    });
  }
}

new AuthControllerTest().run();
