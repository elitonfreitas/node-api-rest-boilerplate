'use strict';

const i18n = require('i18n');
const Logger = require('./Logger');

class Base {
  constructor() {
    i18n.configure({
      locales: ['pt-br'],
      directory: process.cwd() + '/locales',
      defaultLocale: 'en',
      updateFiles: false
    });
    this.t = i18n;

    const getPrefix = () => {
      let logPrefix = '';
      if (this.constructor && this.constructor.name) {
        logPrefix += `[${this.constructor.name}]`;
      }
      return logPrefix;
    };

    this.log = {
      info: (...logs) => Logger.info(`${getPrefix()} ${logs.join(' ')}`),
      debug: (...logs) => Logger.debug(`${getPrefix()} ${logs.join(' ')}`),
      error: (...logs) => Logger.error(`${getPrefix()} ${logs.join(' ')}`),
      warn: (...logs) => Logger.error(`${getPrefix()} ${logs.join(' ')}`)
    };
  }

  logRequest(req) {
    const body = `Request => Path: ${req.path} | Method: ${req.method} | Body: ${JSON.stringify(req.body)}`;
    const query = `| Query: ${JSON.stringify(req.query)}`;
    const params = `| Params: ${JSON.stringify(req.params)}`;
    this.log.debug(body, params, query);
  }
}

module.exports = Base;
