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
