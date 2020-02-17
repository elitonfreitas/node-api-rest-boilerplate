'use strict';

const RequestPromise = require('request-promise');
const Validator = require('./utils/Validator');
const Messages = require('./constants/Messages');
const DataUtils = require('./utils/DataUtils');
const Base = require('./Base');

class Controller extends Base {
  constructor(request = RequestPromise) {
    super();
    this.DataUtils = DataUtils;
    this.Validator = Validator;
    this.Messages = Messages;
    this.request = request;
  }

  throwError(message) {
    throw new Error(message);
  }
}

module.exports = Controller;
