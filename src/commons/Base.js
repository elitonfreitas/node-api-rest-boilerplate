'use strict';

const path = require('path');
const i18n = require('i18n');
const Logger = require('./Logger');
const ValidatorUtils = require('./utils/ValidatorUtils');
const Messages = require('./constants/Messages');
const HttpStatusCode = require('./constants/HttpStatusCode');

class Base {
  constructor() {
    this.ValidatorUtils = ValidatorUtils;
    this.Messages = Messages;
    this.HttpStatusCode = HttpStatusCode;
    i18n.configure({
      locales: process.env.I18N_LOCALES ? process.env.I18N_LOCALES.split(',') : ['pt-br'],
      directory: path.join(__dirname, '../', '/locales'),
      defaultLocale: 'en',
      updateFiles: false,
    });
    this.t = i18n;

    this.log = {
      info: (...logs) => this.logByType('info', logs),
      debug: (...logs) => this.logByType('debug', logs),
      error: (...logs) => this.logByType('error', logs),
      warn: (...logs) => this.logByType('warn', logs),
    };
  }

  getClass() {
    let logClass;
    if (this.constructor && this.constructor.name) {
      logClass = `${this.constructor.name}`;
    }
    return logClass;
  }

  logByType(type, logs) {
    let message = '';
    let data = {};
    logs.map(log => {
      if (typeof log === 'object') {
        if (log.message) {
          message = log.message;
        }
        data = { ...data, ...log };
        delete data.message;
      } else {
        message += ` ${log}`;
      }
    });
    Logger[type]({ className: this.getClass(), message, data });
  }

  logRequest(req, res) {
    const logData = {
      message: 'API Request',
      id: res.id,
      ip: req.ip,
      method: req.method,
      route: req.path,
      params: req.params,
      query: req.query,
      body: process.env.LOG_LEVEL === 'debug' ? req.body : undefined,
      headers: process.env.LOG_LEVEL === 'debug' ? req.headers : undefined,
    };
    this.log.info(logData);
  }
}

module.exports = Base;
