'use strict';

const HttpStatusCode = require('./constants/HttpStatusCode');

class HttpError extends Error {
  constructor(message, statusCode = HttpStatusCode.BAD_REQUEST, data = {}) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = HttpError;
