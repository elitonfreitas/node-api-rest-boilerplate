'use strict';

const TestBase = require('../../../TestBase');
const TemplateModel = require('../../../../../src/models/Template.model');
const ValidatorUtils = require('../../../../../src/commons/utils/ValidatorUtils');

class TemplateController extends TestBase {
  constructor() {
    const validator = {
      post: ValidatorUtils.getValidationSchema(TemplateModel, 'post'),
      put: ValidatorUtils.getValidationSchema(TemplateModel, 'put')
    };
    super('../../src/api/modules/template/controllers/TemplateController', false, false, TemplateModel);
    this.controller.Validator = validator;
  }

  test() {
    const mongoQuery = this.methods;

    it('should get one template with success', async () => {
      mongoQuery.lean = () => Promise.resolve({ _id: 1 });

      this.stub(this.controller.Model, 'findOne').returns(mongoQuery);
      this.restore(this.controller.Model.findOne);

      await this.controller.get(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });

    it('should get one template without results', async () => {
      mongoQuery.lean = () => Promise.resolve(null);

      this.stub(this.controller.Model, 'findOne').returns(mongoQuery);

      await this.controller.get(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should get all template with success', async () => {
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

    it('should get all template without results', async () => {
      this.req.params = {};
      mongoQuery.lean = () => Promise.resolve([]);

      this.stub(this.controller.Model, 'find').returns(mongoQuery);
      this.stub(this.controller.Model, 'countDocuments').returns(Promise.resolve(0));

      await this.controller.get(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should post one template with success', async () => {
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

      this.expectedResponse.data.result = this.req.body;

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });

    it('should post one template with error', async () => {
      this.stub(this.controller.Model.prototype, 'save').returns(Promise.resolve(null));

      this.expectedErrorResponse.message = 'Error on try to save data';

      await this.controller.post(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should put one template with success', async () => {
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

    it('should put one template but not update', async () => {
      this.req.params = { id: 1 };
      this.expectedErrorResponse.message = 'Update not effective';

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(null));

      await this.controller.put(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should put one template with params error', async () => {
      this.req.params = {};
      this.expectedErrorResponse.message = 'Invalid params';

      this.stub(this.controller.Model, 'findOneAndUpdate').returns(Promise.resolve(null));

      await this.controller.put(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should delete one template with success', async () => {
      this.req.params = { id: 1 };

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.resolve({ id: 1 }));
      this.restore(this.controller.Model.findOneAndRemove);

      this.expectedResponse.data = {};

      await this.controller.delete(this.req, this.res);
      expect(this.status.calledWith(200)).toBe(true);
      expect(this.json.calledWith(this.expectedResponse)).toBe(true);
    });

    it('should delete one template but not found', async () => {
      this.req.params = { id: 1 };
      this.expectedErrorResponse.message = 'Data not found';

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.reject());

      await this.controller.delete(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });

    it('should delete one template with params error', async () => {
      this.req.params = {};
      this.expectedErrorResponse.message = 'Invalid params';

      this.stub(this.controller.Model, 'findOneAndRemove').returns(Promise.resolve(null));

      await this.controller.delete(this.req, this.res);
      expect(this.status.calledWith(400)).toBe(true);
      expect(this.json.calledWith(this.expectedErrorResponse)).toBe(true);
    });
  }
}

new TemplateController().run();
