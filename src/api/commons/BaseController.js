'use strict';

const HttpController = require('../../commons/HttpController');

class BaseController extends HttpController {
  constructor(Model, Validator) {
    super();
    this.Model = Model;
    this.Validator = Validator;
  }

  async get(req, res, next) {
    const search = req.params.id ? { _id: req.params.id } : {};
    let result = await this.Model.find(search).lean();

    if (result.length) {
      if (req.params.code) {
        result = result[0];
      }
      this.response(res, next, result);
    } else {
      this.responseError(res, next, this.Messages.NO_RESULT);
    }
  }

  async post(req, res, next) {
    req.checkBody(this.Validator.post);
    const errors = req.validationErrors();

    if (errors && errors.length) {
      this.responseError(res, next, this.getValidatorErrors(errors));
    } else {
      const model = new this.Model(this.DataUtils.normalize(req.body, this.Validator.post));
      const savedModel = await model.save();

      if (savedModel) {
        this.response(res, next, savedModel);
      } else {
        this.responseError(res, next, this.Messages.ERROR_ON_SAVE);
      }
    }
  }

  async put(req, res, next) {
    req.checkBody(this.Validator.put);
    const errors = req.validationErrors();

    if (errors && errors.length) {
      this.responseError(res, next, this.getValidatorErrors(errors));
    } else {
      if (req.params.id) {
        const setUpdate = this.DataUtils.normalize(req.body, this.Validator.put);
        setUpdate.LastUpdate = this.moment().toISOString(true);
        const savedModel = await this.Model.findOneAndUpdate({ _id: req.params.id }, { $set: setUpdate }, { new: true });

        if (savedModel) {
          this.response(res, next, savedModel);
        } else {
          this.responseError(res, next, this.Messages.ERROR_ON_UPDATE);
        }
      } else {
        this.responseError(res, next, this.Messages.INVALID_PARAMS);
      }
    }
  }

  async delete(req, res, next) {
    if (req.params.id) {
      const result = await this.Model.findOneAndRemove({ _id: req.params.id });

      if (result.id) {
        this.response(res, next, {}, this.Messages.SUCCESS_ON_DELETE);
      } else {
        this.responseError(res, next, this.Messages.DELETE_ITEM_NOT_FOUND);
      }
    } else {
      this.responseError(res, next, this.Messages.INVALID_PARAMS);
    }
  }
}

module.exports = BaseController;
