'use strict';

const timezone = process.env.TZ || 'America/Sao_Paulo';
const moment = require('moment-timezone');
moment.tz.setDefault(timezone);

module.exports = {
  customValidators: {
    isDateTime: value => {
      return moment(value, 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ').isValid();
    },
    isObject: value => {
      return typeof value === 'object';
    },
    isArray: value => {
      return Array.isArray(value);
    },
    isArrayOfObject: value => {
      let isArray = Array.isArray(value);
      if (isArray) {
        value.forEach(item => {
          if (typeof item !== 'object') {
            isArray = false;
            return;
          }
        });
      }
      return isArray;
    },
    isArrayOfString: value => {
      let isArray = Array.isArray(value);
      if (isArray) {
        value.forEach(item => {
          if (typeof item !== 'string') {
            isArray = false;
            return;
          }
        });
      }
      return true;
    },
    isArrayOfNumber: value => {
      let isArray = Array.isArray(value);
      if (isArray) {
        value.forEach(item => {
          if (typeof item !== 'number') {
            isArray = false;
            return;
          }
        });
      }
      return isArray;
    }
  }
};
