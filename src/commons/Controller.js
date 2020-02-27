'use strict';

const Request = require('axios');
const DataUtils = require('./utils/DataUtils');
const Base = require('./Base');

class Controller extends Base {
  constructor(request = Request) {
    super();
    this.DataUtils = DataUtils;
    this.request = request;
  }
}

module.exports = Controller;
