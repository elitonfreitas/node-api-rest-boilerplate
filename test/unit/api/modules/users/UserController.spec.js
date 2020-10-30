'use strict';

const TestBase = require('../../../TestBase');
const UserModel = require('../../../../../src/models/User.model');
const ValidatorUtils = require('../../../../../src/commons/utils/ValidatorUtils');

class UserControllerTest extends TestBase {
  constructor() {
    const validator = {
      post: ValidatorUtils.getValidationSchema(UserModel, 'post'),
      put: ValidatorUtils.getValidationSchema(UserModel, 'put')
    };
    super('../../src/api/modules/users/controllers/UserController', false, false, UserModel);
    this.controller.Validator = validator;
  }

  test() {
    const mongoQuery = this.methods;

    it('should get one user with success', async () => {
      const data = { _id: 1 };
      mongoQuery.lean = () => Promise.resolve(data);

      this.stub(this.controller.Model, 'findOne').returns(mongoQuery);
      this.restore(this.controller.Model.findOne);

      const response = await this.controller.get(this.req);
      expect(response).toStrictEqual(data);
    });

    it('should get one user without results', async () => {
      mongoQuery.lean = () => Promise.resolve(null);
      this.stub(this.controller.Model, 'findOne').returns(mongoQuery);

      try {
        await this.controller.get(this.req);
      } catch (error) {
        expect(error.message).toStrictEqual(this.Messages.NO_RESULT);
      }
    });

    it('should get all users with success', async () => {
      this.req.params = {};
      const data = [{ _id: 1 }];
      mongoQuery.lean = () => Promise.resolve(data);

      this.stub(this.controller.Model, 'find').returns(mongoQuery);
      this.stub(this.controller.Model, 'countDocuments').returns(Promise.resolve(1));
      this.restore(this.controller.Model.find);
      this.restore(this.controller.Model.countDocuments);

      const resposnse = await this.controller.get(this.req);
      expect(resposnse).toStrictEqual(this.expectedResponsePager.data);
    });

    it('should get all users without results', async () => {
      this.req.params = {};
      mongoQuery.lean = () => Promise.resolve([]);

      this.stub(this.controller.Model, 'find').returns(mongoQuery);
      this.stub(this.controller.Model, 'countDocuments').returns(Promise.resolve(0));

      try {
        await this.controller.get(this.req);
      } catch (error) {
        expect(error.message).toStrictEqual(this.Messages.NO_RESULT);
      }
    });

    it('should post one user with success', async () => {
      this.req.body = {
        name: 'Teste 3',
        description: 'teste',
        active: true,
        images: [
          {
            name: 'Imagem 2',
            filePath: 'Imagem2.jpg'
          }
        ],
        usersPath: 'teste.jpg'
      };

      this.stub(this.controller.Model.prototype, 'save').returns(Promise.resolve(this.req.body));
      this.restore(this.controller.Model.prototype.save);

      this.expectedResponse.data = this.req.body;

      const response = await this.controller.post(this.req);
      expect(response).toStrictEqual(this.expectedResponse.data);
    });

    it('should post one user with error', async () => {
      this.stub(this.controller.Model.prototype, 'save').returns(Promise.resolve(null));

      try {
        await this.controller.post(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.ERROR_ON_SAVE);
      }
    });

    it('should put one user with success', async () => {
      this.req.params = { id: 1 };
      this.req.body = {
        name: 'Teste 3',
        description: 'teste',
        active: true,
        images: [
          {
            name: 'Imagem 2',
            filePath: 'Imagem2.jpg'
          }
        ],
        usersPath: 'teste.jpg'
      };

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(this.req.body));
      this.restore(this.controller.Model.findOneAndUpdate);

      this.expectedResponse.data = this.req.body;

      const response = await this.controller.put(this.req);
      expect(response).toStrictEqual(this.expectedResponse.data);
    });

    it('should put one user but not update', async () => {
      this.req.params = { id: 1 };

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(null));

      try {
        await this.controller.put(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.UPDATE_NOT_OCURRED);
      }
    });

    it('should put one user with params error', async () => {
      this.req.params = {};

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(null));

      try {
        await this.controller.put(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.INVALID_PARAMS);
      }
    });

    it('should delete one user with success', async () => {
      this.req.params = { id: 1 };

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.resolve({ id: 1 }));
      this.restore(this.controller.Model.findOneAndRemove);

      const response = await this.controller.delete(this.req);
      expect(response).toStrictEqual({});
    });

    it('should delete one user but not found', async () => {
      this.req.params = { id: 1 };

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.reject());

      try {
        await this.controller.delete(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.DATA_NOT_FOUND);
      }
    });

    it('should delete one user with params error', async () => {
      this.req.params = {};

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.resolve(null));

      try {
        await this.controller.delete(this.req);
      } catch (error) {
        expect(error.message).toBe(this.Messages.INVALID_PARAMS);
      }
    });
  }
}

new UserControllerTest().run();
