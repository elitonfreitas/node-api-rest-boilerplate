'use strict';

const Messages = require('../constants/Messages');

class ValidatorUtils {
  constructor() {
    this.AttributeMap = {
      post: {
        required: 'notEmpty',
        errorMessage: 'errorMessage',
        type: 'type',
        optional: 'optional',
      },
      put: {
        upRequired: 'notEmpty',
        upErrorMessage: 'errorMessage',
        type: 'type',
        optional: 'optional',
      },
    };
    this.ValidatorTypes = {
      Number: {
        isNumeric: {
          errorMessage: Messages.FIELD_NUMERIC,
        },
      },
      Array: {
        isArray: {
          errorMessage: Messages.FIELD_ARRAY_OBJECT,
        },
      },
      Boolean: {
        isBoolean: {
          errorMessage: Messages.FIELD_BOOLEAN,
        },
      },
    };
  }

  setValidatorType(type) {
    return this.ValidatorTypes[type] || {};
  }

  formatValidationSchema(attr, verb) {
    const resultItem = {};
    for (const key in attr) {
      if (attr.hasOwnProperty(key)) {
        if (this.AttributeMap[verb][key] || key.indexOf('is') === 0) {
          if (key === 'type') {
            Object.assign(resultItem, this.setValidatorType(attr[key].name));
            if (!resultItem['custom']) {
              resultItem['custom'] = {};
            }
            resultItem['custom']['options'] = () => ({ type: attr[key].name });
          } else {
            if (key.indexOf('is') === 0) {
              resultItem[key] = attr[key];
            } else {
              resultItem[this.AttributeMap[verb][key]] = attr[key];
            }
          }
        }
      }
    }
    return resultItem;
  }

  getValidationSchema(model, verb) {
    const result = {};
    if (model.schema && model.schema.obj) {
      const attrs = model.schema.obj;
      for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          const isArray = Array.isArray(attrs[key]);
          const subObject = attrs[key][0];
          if (isArray && subObject) {
            const object = subObject.obj;
            for (const subKey in object) {
              if (object.hasOwnProperty(subKey) && object[subKey]) {
                result[`${key}.*.${subKey}`] = this.formatValidationSchema(object[subKey], verb);
              }
            }
          } else {
            result[key] = this.formatValidationSchema(attrs[key], verb);
          }
        }
      }
    }

    return result;
  }

  isOjbect(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  isNumber(item) {
    if (item) {
      const value = Number(item);
      return !isNaN(value) && typeof value === 'number';
    }
    return false;
  }
}

module.exports = new ValidatorUtils();
