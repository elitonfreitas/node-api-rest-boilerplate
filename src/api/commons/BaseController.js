'use strict';

const HttpController = require('../../commons/HttpController');

class BaseController extends HttpController {
  constructor(Model, Validator) {
    super();
    this.Model = Model;
    this.Validator = Validator;
  }

  _normalizePager(req, mongoQuery) {
    const current = req.query.current || req.body.current || 1;
    const limit = req.query.limit || req.body.limit || 10;
    const pageNumber = current > 0 ? (current - 1) * limit : 0;
    const queryPager = mongoQuery.skip(pageNumber * limit).limit(limit);
    const pager = { current, limit };
    return { queryPager, pager };
  }

  async get(req) {
    if (req.params.id) {
      const result = await this.Model.findOne({ _id: req.params.id }, { __v: 0 }).lean();
      if (result) {
        return result;
      } else {
        throw new Error(this.Messages.NO_RESULT);
      }
    } else {
      const baseQuery = this.Model.find({}, { __v: 0 });
      const { queryPager, pager } = this._normalizePager(req, baseQuery);
      const promises = [queryPager.lean(), this.Model.countDocuments()];
      const [list, total] = await Promise.all(promises);
      pager.total = total || 0;

      if (list.length) {
        return { list, pager };
      } else {
        throw new Error(this.Messages.NO_RESULT);
      }
    }
  }

  async post(req) {
    const model = new this.Model(this.DataUtils.normalize(req.body, this.Validator.post));
    const savedModel = await model.save();

    if (savedModel) {
      return savedModel;
    } else {
      throw new Error(this.Messages.ERROR_ON_SAVE);
    }
  }

  async put(req) {
    if (req.params.id) {
      const setUpdate = this.DataUtils.normalize(req.body, this.Validator.put);
      setUpdate.updatedAt = this.moment().toISOString(true);
      const result = await this.Model.findOneAndUpdate({ _id: req.params.id }, { $set: setUpdate }, { new: true });

      if (result) {
        return result;
      } else {
        throw new Error(this.Messages.UPDATE_NOT_OCURRED);
      }
    } else {
      throw new Error(this.Messages.INVALID_PARAMS);
    }
  }

  async delete(req) {
    if (req.params.id) {
      let result;
      try {
        result = await this.Model.findOneAndRemove({ _id: req.params.id });
      } catch (error) {
        result = {};
      }

      if (result && result.id) {
        return {};
      } else {
        throw new Error(this.Messages.DATA_NOT_FOUND);
      }
    } else {
      throw new Error(this.Messages.INVALID_PARAMS);
    }
  }
}

module.exports = BaseController;
