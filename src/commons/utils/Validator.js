'use strict';

class Validator {
  isValidTR(tr) {
    return /(^[a-zA-Z]{2})+(\d{6})+$/.test(tr);
  }

  isValidBA(ba) {
    return /(\d{15})+$/.test(ba);
  }

  isOjbect(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  isNumber(item) {
    if (item) {
      item = Number(item);
      return typeof item === 'number';
    }
    return false;
  }
}

module.exports = new Validator();
