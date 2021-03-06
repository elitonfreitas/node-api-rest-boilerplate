'use strict';

const TestBase = require('test/unit/TestBase');
const UserModel = require('src/api/modules/users/models/User.model');
const ValidatorUtils = require('src/commons/utils/ValidatorUtils');

class UserControllerTest extends TestBase {
  constructor() {
    const validator = {
      post: ValidatorUtils.getValidationSchema(UserModel, 'post'),
      put: ValidatorUtils.getValidationSchema(UserModel, 'put'),
    };
    super('src/api/modules/users/controllers/UserController', false, false, UserModel);
    this.controller.Validator = validator;
    this.passtest = '123456';
  }

  test() {
    let userId;
    const fakeId = '5fa40246f72bcbe27715c071';
    const userData = {
      name: 'User jest test',
      email: 'user@test.com',
      password: this.passtest,
      profiles: [1],
      active: true,
      addresses: [
        {
          address: 'Rua AB',
          number: '111',
          postCode: '50234-234',
          neighborhood: 'teste',
          city: 'Recife',
          state: 'PE',
          country: 'Brasil',
        },
      ],
    };
    const updateUser = Object.assign({}, userData, { profiles: [2] });

    it('should create one user with success', async () => {
      this.req.body = userData;
      const response = await this.controller.post(this.req);
      userId = response.data._id;
      expect(response.data.name).toStrictEqual(userData.name);
    });

    it('should create one user with error', async () => {
      this.req.body = {};
      try {
        await this.controller.post(this.req);
      } catch (error) {
        expect(error.message).toContain('validation failed');
      }
    });

    it('should get one user with success', async () => {
      this.req.params.id = userId;
      const response = await this.controller.get(this.req);
      expect(response.data.name).toStrictEqual(userData.name);
    });

    it('should get one user without results', async () => {
      this.req.params.id = fakeId;
      const response = await this.controller.get(this.req);
      expect(response.message).toStrictEqual(this.Messages.NO_RESULT);
    });

    it('should get all users with success', async () => {
      this.req.params = {};
      this.req.query = { limit: 10 };
      const resposnse = await this.controller.get(this.req);
      expect(resposnse.data.list).toHaveLength(1);
      expect(resposnse.data.pager).toEqual({ current: 1, limit: 10, total: 1 });
    });

    it('should put one user with success', async () => {
      this.req.params.id = userId;
      this.req.body = updateUser;
      const response = await this.controller.put(this.req);
      expect(response.data.profiles).toHaveLength(1);
    });

    it('should put one user but not update', async () => {
      this.req.params.id = fakeId;
      try {
        await this.controller.put(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.UPDATE_NOT_OCURRED);
      }
    });

    it('should put one user with params error', async () => {
      this.req.params = {};
      try {
        await this.controller.put(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.INVALID_PARAMS);
      }
    });

    it('should delete one user with success', async () => {
      this.req.params.id = userId;
      const response = await this.controller.delete(this.req);
      expect(response.data).toStrictEqual({ deletedCount: 1 });
    });

    it('should delete one user but not found', async () => {
      this.req.params.id = fakeId;
      try {
        await this.controller.delete(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.DATA_NOT_FOUND);
      }
    });

    it('should delete one user with params error', async () => {
      this.req.params = {};
      try {
        await this.controller.delete(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.INVALID_PARAMS);
      }
    });

    it('should get all users without results', async () => {
      this.req.params = {};
      const response = await this.controller.get(this.req);
      expect(response.message).toStrictEqual(this.Messages.NO_RESULT);
    });
  }
}

new UserControllerTest().run();
