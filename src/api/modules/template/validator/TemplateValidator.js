'use strict';

const Messages = require('../../../../commons/constants/Messages');

module.exports = {
  post: {
    name: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED
    },
    description: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED
    },
    images: {
      notEmpty: true,
      isArray: {
        errorMessage: Messages.FIELD_ARRAY_OBJECT
      }
    },
    templatePath: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED
    },
    active: {
      notEmpty: true,
      errorMessage: Messages.FIELD_REQUIRED,
      isBoolean: {
        errorMessage: Messages.FIELD_BOOLEAN
      }
    }
  },
  put: {
    name: {},
    description: {},
    images: {
      optional: true,
      isArray: {
        errorMessage: Messages.FIELD_ARRAY_OBJECT
      }
    },
    templatePath: {},
    active: {
      optional: true,
      isBoolean: {
        errorMessage: Messages.FIELD_BOOLEAN
      }
    }
  }
};
