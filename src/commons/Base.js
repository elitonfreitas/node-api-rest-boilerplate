'use strict';

const i18n = require('i18n');
const Logger = require('./Logger');
const ValidatorUtils = require('./utils/ValidatorUtils');
const Messages = require('./constants/Messages');

class Base {
  constructor() {
    this.ValidatorUtils = ValidatorUtils;
    this.Messages = Messages;
    i18n.configure({
      locales: ['pt-br'],
      directory: process.cwd() + '/locales',
      defaultLocale: 'en',
      updateFiles: false
    });
    this.t = i18n;

    this.log = {
      info: (...logs) => this.logByType('info', logs),
      debug: (...logs) => this.logByType('debug', logs),
      error: (...logs) => this.logByType('error', logs),
      warn: (...logs) => this.logByType('warn', logs)
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
    let metadata = {};
    logs.map(log => {
      if (typeof log === 'object') {
        if (log.message) {
          message = log.message;
        }
        metadata = { ...metadata, ...log };
        delete metadata.message;
      } else {
        message += log;
      }
    });
    Logger[type]({ className: this.getClass(), message, metadata });
  }

  logRequest(req) {
    const logData = {
      message: 'API Request',
      body: `${JSON.stringify(req.body)}`,
      query: `${JSON.stringify(req.query)}`,
      params: req.params
    };
    this.log.debug(logData);
  }
}

module.exports = Base;
