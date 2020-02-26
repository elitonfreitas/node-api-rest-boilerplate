'use strict';

const TestBase = require('../../TestBase');
const TemplateModel = require('../../../../src/models/Template.model');
const ValidatorUtils = require('../../../../src/commons/utils/ValidatorUtils');

class BaseController extends TestBase {
  constructor() {
    const validator = {
      post: ValidatorUtils.getValidationSchema(TemplateModel, 'post'),
      put: ValidatorUtils.getValidationSchema(TemplateModel, 'put')
    };
    super('../../src/api/commons/BaseController', false, true, TemplateModel, validator);
  }

  test() {
    const mongoQuery = this.methods;

    it('should get one model data', async () => {
      mongoQuery.lean = () => Promise.resolve({ _id: 1 });

      this.stub(this.controller.Model, 'findOne').returns(mongoQuery);
      this.restore(this.controller.Model.findOne);

      await this.controller.get(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });

    it('should get one model data without results', async () => {
      mongoQuery.lean = () => Promise.resolve(null);

      this.stub(this.controller.Model, 'findOne').returns(mongoQuery);

      await this.controller.get(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should get all model data', async () => {
      this.req.params = {};
      mongoQuery.lean = () => Promise.resolve([{ _id: 1 }]);

      this.stub(this.controller.Model, 'find').returns(mongoQuery);
      this.stub(this.controller.Model, 'countDocuments').returns(Promise.resolve(1));
      this.restore(this.controller.Model.find);
      this.restore(this.controller.Model.countDocuments);

      await this.controller.get(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponsePager)).toBe(true);
    });

    it('should get all model data without results', async () => {
      this.req.params = {};
      mongoQuery.lean = () => Promise.resolve([]);

      this.stub(this.controller.Model, 'find').returns(mongoQuery);
      this.stub(this.controller.Model, 'countDocuments').returns(Promise.resolve(0));

      await this.controller.get(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should post one model data', async () => {
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
        templatePath: 'teste.jpg'
      };

      this.stub(this.controller.Model.prototype, 'save').returns(Promise.resolve(this.req.body));
      this.restore(this.controller.Model.prototype.save);

      this.expectedResponse.data = this.req.body;

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });

    it('should post one model data with error', async () => {
      this.stub(this.controller.Model.prototype, 'save').returns(Promise.resolve(null));

      this.expectedErrorResponse.message = 'Error on try to save data';

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should put one model data', async () => {
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
        templatePath: 'teste.jpg'
      };

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(this.req.body));
      this.restore(this.controller.Model.findOneAndUpdate);

      this.expectedResponse.data.result = this.req.body;

      await this.controller.put(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });

    it('should put one model data but not update', async () => {
      this.req.params = { id: 1 };
      this.expectedErrorResponse.message = 'Update not effective';

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(null));

      await this.controller.put(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should put one model data with params error', async () => {
      this.req.params = {};
      this.expectedErrorResponse.message = 'Invalid params';

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(null));

      await this.controller.put(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should delete one model data', async () => {
      this.req.params = { id: 1 };

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.resolve({ id: 1 }));
      this.restore(this.controller.Model.findOneAndRemove);

      this.expectedResponse.data = {};

      await this.controller.delete(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });

    it('should delete one model data but not found', async () => {
      this.req.params = { id: 1 };
      this.expectedErrorResponse.message = 'Data not found';

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.reject());

      await this.controller.delete(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should delete one model data with params error', async () => {
      this.req.params = {};
      this.expectedErrorResponse.message = 'Invalid params';

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.resolve(null));

      await this.controller.delete(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });
  }
}

new BaseController().run();
