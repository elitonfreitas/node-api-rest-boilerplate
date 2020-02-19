'use strict';

const HttpController = require('../../commons/HttpController');

class BaseController extends HttpController {
  constructor(Model, Validator) {
    super();
    this.Model = Model;
    this.Validator = Validator;
  }

  _normalizePager(req, mongoQuery) {
    const pageIndex = req.query.pageIndex || req.body.pageIndex || 1;
    const limit = req.query.limit || req.body.limit || 10;
    const pageNumber = pageIndex > 0 ? (pageIndex - 1) * limit : 0;
    const queryPager = mongoQuery.skip(pageNumber * limit).limit(limit);
    return { queryPager, pageIndex, limit };
  }

  async get(req, res, next) {
    if (req.params.id) {
      const result = await this.Model.findOne({ _id: req.params.id }, { __v: 0 }).lean();
      if (result) {
        this.response(res, next, { result }, this.Messages.SUCCESS);
      } else {
        this.responseError(res, next, this.Messages.NO_RESULT);
      }
    } else {
      const baseQuery = this.Model.find({}, { __v: 0 });
      const { queryPager, pageIndex, limit } = this._normalizePager(req, baseQuery);
      const result = await queryPager.lean();
      const total = await this.Model.countDocuments();

      if (result.length) {
        this.response(res, next, { result, pageIndex, limit, total }, this.Messages.SUCCESS);
      } else {
        this.responseError(res, next, this.Messages.NO_RESULT);
      }
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
      const result = await this.Model.findOneAndUpdate({ _id: req.params.id }, { $set: setUpdate }, { new: true });

      if (result) {
        this.response(res, next, { result }, this.Messages.SUCCESS);
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
