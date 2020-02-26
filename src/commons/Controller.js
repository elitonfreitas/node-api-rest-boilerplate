'use strict';

const RequestPromise = require('request-promise');
const DataUtils = require('./utils/DataUtils');
const Base = require('./Base');

class Controller extends Base {
  constructor(request = RequestPromise) {
    super();
    this.DataUtils = DataUtils;
    this.request = request;
  }
}

module.exports = Controller;
