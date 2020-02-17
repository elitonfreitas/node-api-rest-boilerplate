'use strict';

const Logger = require('./Logger');

class Base {
  constructor() {
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
}

module.exports = Base;
