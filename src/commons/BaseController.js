'use strict';

const HttpController = require('./HttpController');
const HttpError = require('./HttpError');

class BaseController extends HttpController {
  constructor(Model, Validator) {
    super();
    this.Model = Model;
    this.Validator = Validator;
  }

  async get(req) {
    const { select } = req.query || { __v: 0 };

    if (req.params.id) {
      const result = await this.Model.findOne({ _id: req.params.id }, select);
      return {
        data: result || {},
        message: result ? this.Messages.SUCCESS : this.Messages.NO_RESULT,
      };
    } else {
      const usePager = req.query.limit || req.body.limit || req.query.current || req.body.current || 0;

      if (usePager) {
        const filters = this.normalizeFilter(req);
        const baseQuery = this.Model.find(filters, select);
        const { pagerQuery, pager } = this.normalizePager(req, baseQuery);
        const finalQuery = this.normalizeSortBy(req, pagerQuery);
        const promises = [finalQuery, this.Model.countDocuments(filters)];

        const [list, total] = await Promise.all(promises);
        pager.total = total || 0;

        return {
          data: { list, pager },
          message: list.length ? this.Messages.SUCCESS : this.Messages.NO_RESULT,
        };
      } else {
        const data = await this.Model.find({}, select);

        return {
          data,
          message: data.length ? this.Messages.SUCCESS : this.Messages.NO_RESULT,
        };
      }
    }
  }

  async post(req) {
    const body = this.DataUtils.normalize(req.body, this.Validator.post);
    const model = new this.Model(body);
    const savedModel = await model.save();
    return {
      data: savedModel,
      statusCode: this.HttpStatusCode.CREATED,
    };
  }

  async put(req) {
    if (req.params.id) {
      const setUpdate = this.DataUtils.normalize(req.body, this.Validator.put);
      const result = await this.Model.findOneAndUpdate({ _id: req.params.id }, { $set: setUpdate }, { new: true });

      if (result) {
        return {
          data: result,
          statusCode: this.HttpStatusCode.ACCEPTED,
        };
      } else {
        throw new HttpError(this.Messages.UPDATE_NOT_OCURRED, this.HttpStatusCode.NOT_FOUND);
      }
    } else {
      throw new HttpError(this.Messages.INVALID_PARAMS);
    }
  }

  async delete(req) {
    const items = req.params.id ? [req.params.id] : req.body;

    if (items && items.length) {
      const result = await this.Model.deleteMany({ _id: { $in: items } });

      if (result && result.deletedCount) {
        return { data: { deletedCount: result.deletedCount }, statusCode: this.HttpStatusCode.ACCEPTED };
      } else {
        throw new HttpError(this.Messages.DATA_NOT_FOUND, this.HttpStatusCode.NOT_FOUND);
      }
    } else {
      throw new HttpError(this.Messages.INVALID_PARAMS);
    }
  }
}

module.exports = BaseController;
