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
    let result = await this.Model.find(search, { __v: 0 }).lean();

    if (result.length) {
      if (req.params.id) {
        result = result[0];
      }
      this.response(res, next, result, this.Messages.SUCCESS);
    } else {
      this.responseError(res, next, this.Messages.NO_RESULT);
    }
  }

  async post(req, res, next) {
    const model = new this.Model(this.DataUtils.normalize(req.body, this.Validator.post));
    const savedModel = await model.save();

    if (savedModel) {
      this.response(res, next, savedModel, this.Messages.SUCCESS);
    } else {
      this.responseError(res, next, this.Messages.ERROR_ON_SAVE);
    }
  }

  async put(req, res, next) {
    if (req.params.id) {
      const setUpdate = this.DataUtils.normalize(req.body, this.Validator.put);
      setUpdate.updatedAt = this.moment().toISOString(true);
      const savedModel = await this.Model.findOneAndUpdate({ _id: req.params.id }, { $set: setUpdate }, { new: true });

      if (savedModel) {
        this.response(res, next, savedModel, this.Messages.SUCCESS);
      } else {
        this.responseError(res, next, this.Messages.UPDATE_NOT_OCURRED);
      }
    } else {
      this.responseError(res, next, this.Messages.INVALID_PARAMS);
    }
  }

  async delete(req, res, next) {
    if (req.params.id) {
      let result;
      try {
        result = await this.Model.findOneAndRemove({ _id: req.params.id });
      } catch (error) {
        result = {};
      }

      if (result && result.id) {
        this.response(res, next, {}, this.Messages.SUCCESS);
      } else {
        this.responseError(res, next, this.Messages.DATA_NOT_FOUND);
      }
    } else {
      this.responseError(res, next, this.Messages.INVALID_PARAMS);
    }
  }
}

module.exports = BaseController;
