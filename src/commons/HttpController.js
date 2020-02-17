'use strict';

const timezone = process.env.TZ || 'America/Sao_Paulo';
const moment = require('moment-timezone');
moment.tz.setDefault(timezone);

const Controller = require('./Controller');

class HttpController extends Controller {
  constructor() {
    super();
    this.moment = moment;
  }

  response(res, next, response = {}, message = '', status = 200) {
    const data = typeof response === 'object' ? response : { value: response };
    message = message instanceof Error || message.message ? message.message : message;
    const result = { message, data };

    status = isNaN(status) ? 400 : status;
    res.status(status).json(result);

    this.log.debug(`Status: ${status} | Response: ${JSON.stringify(result)}`);
  }

  responseError(res, next, message, data, status = 400) {
    this.response(res, next, data, message, status);
  }
}

module.exports = HttpController;
