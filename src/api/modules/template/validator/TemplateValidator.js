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
      errorMessage: 'O atributo "name" é obrigatório'
    },
    Name: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      },
      notEmpty: true,
      errorMessage: 'O atributo "Name" é obrigatório'
    },
    ViewCode: {
      custom: {
        options: () => {
          return {
            type: 'string'
          };
        }
      },
      notEmpty: true,
      errorMessage: 'O atributo "ViewCode" é obrigatório'
    },
    Tolerance: {
      custom: {
        options: () => {
          return {
            type: 'number'
          };
        }
      },
      notEmpty: true,
      isInt: {
        errorMessage: 'O atributo "Tolerance" deve ser um inteiro em segundos'
      },
      errorMessage: 'O atributo "Tolerance" é obrigatório'
    },
    MaxNotification: {
      custom: {
        options: () => {
          return {
            type: 'number'
          };
        }
      },
      notEmpty: true,
      isInt: {
        errorMessage: 'O atributo "MaxNotification" deve ser um inteiro'
      },
      errorMessage: 'O atributo "MaxNotification" é obrigatório'
    },
    UraNotify: {
      custom: {
        options: () => {
          return {
            type: 'boolean'
          };
        }
      },
      optional: true,
      isBoolean: {
        errorMessage: 'O atributo "UraNotify" deve ser um valor boolean'
      }
    },
    Active: {
      custom: {
        options: () => {
          return {
            type: 'boolean'
          };
        }
      },
      notEmpty: true,
      isBoolean: {
        errorMessage: 'O atributo "Active" deve ser um valor boolean'
      },
      errorMessage: 'O atributo "Active" é obrigatório'
    },
    Filters: {
      custom: {
        options: () => {
          return {
            type: 'object'
          };
        }
      },
      optional: true,
      isArrayOfObject: {
        errorMessage: 'O atributo "Filters" deve ser um array de objects'
      }
    },
    'RollOut.Uf': {
      custom: {
        options: () => {
          return {
            type: 'array'
          };
        }
      },
      optional: true,
      isArrayOfString: {
        errorMessage: 'O atributo "rollOut.Uf" deve ser um array'
      }
    },
    'RollOut.Gra': {
      custom: {
        options: () => {
          return {
            type: 'array'
          };
        }
      },
      optional: true,
      isArrayOfObject: {
        errorMessage: 'O atributo "rollOut.Gra" deve ser um array de objects'
      }
    },
    UsedRules: {
      custom: {
        options: () => {
          return {
            type: 'array'
          };
        }
      },
      optional: true,
      isArray: {
        errorMessage: 'O atributo "usedRules" deve ser um array'
      }
    },
    ExecutionPeriods: {
      custom: {
        options: () => {
          return {
            type: 'array'
          };
        }
      },
      notEmpty: true,
      errorMessage: 'O atributo "executionPeriods" é obrigatório',
      isArrayOfObject: {
        errorMessage: 'O atributo "executionPeriods" deve ser um array de objects'
      }
    }
  }
};
