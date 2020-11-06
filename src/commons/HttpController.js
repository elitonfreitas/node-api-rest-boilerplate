'use strict';

const timezone = process.env.TZ || 'America/Sao_Paulo';
const moment = require('moment-timezone');
moment.tz.setDefault(timezone);
const Controller = require('./Controller');

class HttpController extends Controller {
  constructor() {
    super();
    this.moment = moment;
    this.disabledMethods = [];
  }

  translateError(msg, locale = 'en') {
    return this.t.__({ phrase: msg, locale });
  }

  response(res, next, response = {}, message = '', status = 200) {
    const data = typeof response === 'object' ? response : { value: response };
    message = message instanceof Error || message.message ? message.message : message;
    const locale = res.req.headers.locale || 'en';
    const result = { message: this.translateError(message, locale), data };

    status = isNaN(status) ? 400 : status;
    res.status(status);
    res.json(result);
    this.log.debug('API Response', { statusCode: status, body: result });
  }

  responseError(res, next, message, data, status = 400) {
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
