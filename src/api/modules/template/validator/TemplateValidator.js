'use strict';

module.exports = {
  post: {
    name: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      },
      notEmpty: true,
      errorMessage: 'Field "name" is required'
    },
    description: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      },
      notEmpty: true,
      errorMessage: 'Field "description" is required'
    },
    images: {
      custom: {
        options: () => {
          return {};
        }
      },
      notEmpty: true,
      isArrayOfObject: {
        errorMessage: 'Field "images" must be an array of objects'
      }
    },
    templatePath: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      },
      notEmpty: true,
      errorMessage: 'Field "templatePath" is required'
    },
    active: {
      custom: {
        options: () => {
          return {
            type: 'boolean'
          };
        }
      },
      notEmpty: true,
      isBoolean: {
        errorMessage: 'Field "active" must be a boolean value'
      },
      errorMessage: 'Field "active" is required'
    }
  },
  put: {
    name: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      }
    },
    description: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      }
    },
    images: {
      custom: {
        options: () => {
          return {};
        }
      },
      isArrayOfObject: {
        errorMessage: 'Field "images" must be an array of objects'
      }
    },
    templatePath: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      }
    },
    active: {
      custom: {
        options: () => {
          return {
            type: 'boolean'
          };
        }
      },
      isBoolean: {
        errorMessage: 'Field "active" must be a boolean value'
      }
    }
  }
};
