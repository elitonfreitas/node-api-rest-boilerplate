'use strict';

const timezone = process.env.TZ || 'America/Sao_Paulo';
const moment = require('moment-timezone');
moment.tz.setDefault(timezone);

const HttpStatusCode = require('./constants/HttpStatusCode');
const Controller = require('./Controller');

class HttpController extends Controller {
  constructor() {
    super();
    this.moment = moment;
    this.disabledMethods = [];
  }

  translateError(msg, locale = 'en') {
    const messages = Array.isArray(msg) ? msg : [msg];
    const results = [];
    for (const message of messages) {
      results.push(this.t.__({ phrase: message, locale }));
    }
    return results;
  }

  response(res, next, response = {}, message = '', status = HttpStatusCode.OK) {
    const data = typeof response === 'object' ? response : { value: response };
    message = message instanceof Error || message.message ? message.message : message;
    const locale = res.req && res.req.headers ? res.req.headers.locale : 'en';
    const result = { message: this.translateError(message, locale), data };

    status = isNaN(status) ? HttpStatusCode.BAD_REQUEST : status;
    res.status(status);
    res.json(result);

    const baseUrl = res.req ? res.req.baseUrl : '/';

    if (![process.env.HEALTH_CHECK_ENDPOINT, '/healthcheck'].includes(baseUrl)) {
      this.log.debug('API Response', {
        id: res.id,
        statusCode: status,
        responseTime: new Date() - res.startTime,
        response: result,
      });
    }
  }

  responseError(res, next, message, data, status = HttpStatusCode.BAD_REQUEST) {
    this.response(res, next, data, message, status);
  }

  _getFilterByType(value) {
    if (!value) return;
    const values = value.split(';');
    const type = values[0];

    switch (type) {
      case 'r':
        return { $regex: new RegExp(values[1], values[2] || undefined) };
      case 'q':
        return { [values[1]]: values[2] };
      case 'n':
        return Number(values[1]);
      case 'b':
        return Boolean(JSON.parse(values[1] || 'false'));
      case 'null':
        return null;
      default:
        return value;
    }
  }

  /* Filter format sample
   * $regex: ?filter=key:r;value;options. Result: { $regex: /value/options }
   * query: ?filter=key:q;mongoKey;value. Result: { $exists: true }
   * number: ?filter=key:n;value. Result: 10
   * boolean: ?filter=key:b;value. Result: false
   * null: ?filter=key:null;. Result: null
   * default: ?filter=key:value. Result: 'value'
   */
  normalizeFilter(req) {
    const filterInfo = (req.query.filter || req.body.filter || '').split('|');
    const filters = {};

    if (filterInfo.length < 1 && !filterInfo[0]) return filters;

    if (filterInfo && filterInfo.length) {
      for (const filter of filterInfo) {
        const filterPart = filter.split(':');

        if (filterPart.length > 1) {
          const value = this._getFilterByType(filterPart[1]);
          if (value !== undefined) {
            filters[filterPart[0]] = value;
          }
        }
      }
    }

    return filters;
  }

  normalizeSortBy(req, mongoQuery) {
    const sortInfo = (req.query.sortBy || req.body.sortBy || '').split('|');
    if (sortInfo && sortInfo.length > 1 && Number(sortInfo[1])) {
      const sortBy = { [sortInfo[0]]: Number(sortInfo[1]) };
      mongoQuery.sort(sortBy);
    }

    return mongoQuery;
  }

  normalizePager(req, mongoQuery) {
    const current = Number(req.query.current || req.body.current) || 1;
    const limit = Number(req.query.limit || req.body.limit || 10);
    const pageNumber = current > 0 ? (current - 1) * limit : 0;
    const pagerQuery = mongoQuery.skip(pageNumber).limit(limit);
    const pager = { current, limit };

    return { pagerQuery, pager };
  }

  async options(req, res) {
    const date = new Date();
    const header = {
      Allow: '',
      'Cache-Control': 'max-age=604800',
      Date: date.toString(),
      Expires: date.toString(),
    };
    res.set(header);
    return {};
  }
}

module.exports = HttpController;
