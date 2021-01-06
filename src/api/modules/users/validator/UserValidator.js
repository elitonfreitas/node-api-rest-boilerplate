'use strict';

const Messages = require('src/commons/constants/Messages');

module.exports = {
  post: {
    name: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    email: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    password: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    active: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED,
      isBoolean: {
        errorMessage: Messages.FIELD_BOOLEAN,
      },
    },
    addresses: {
      notEmpty: true,
      isArray: {
        errorMessage: Messages.FIELD_ARRAY_OBJECT,
      },
    },
    level: {
      isNumeric: true,
    },
  },
  put: {
    addresses: {
      optional: true,
      isArray: {
        errorMessage: Messages.FIELD_ARRAY_OBJECT,
      },
    },
    active: {
      optional: true,
      isBoolean: {
        errorMessage: Messages.FIELD_BOOLEAN,
      },
    },
  },
};
