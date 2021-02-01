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
        upOptional: 'optional',
      },
    };
    this.ValidatorTypes = {
      Array: {
        isArray: {
          errorMessage: Messages.FIELD_ARRAY_OBJECT,
        },
      },
      ObjectId: {
        isMongoId: {
          errorMessage: Messages.FIELD_OBJECT_ID,
        },
      },
      ArrayObjectId: {
        isArray: {
          errorMessage: Messages.FIELD_ARRAY_OBJECT_ID,
        },
        isMongoId: {
          errorMessage: Messages.FIELD_OBJECT_ID,
        },
      },
      Number: {
        isNumeric: {
          errorMessage: Messages.FIELD_NUMERIC,
        },
      },
      ArrayNumber: {
        isArray: {
          errorMessage: Messages.FIELD_ARRAY_NUMERIC,
        },
        isNumeric: {
          errorMessage: Messages.FIELD_NUMERIC,
        },
      },
      Boolean: {
        isBoolean: {
          errorMessage: Messages.FIELD_BOOLEAN,
        },
      },
      ArrayBoolean: {
        isArray: {
          errorMessage: Messages.FIELD_ARRAY_BOOLEAN,
        },
        isBoolean: {
          errorMessage: Messages.FIELD_BOOLEAN,
        },
      },
    };
  }

  setValidatorType(type, opt) {
    const newType = this.ValidatorTypes[type] || {};

    if (opt && Object.keys(newType).length) {
      newType.optional = opt;
    }

    return newType;
  }

  formatValidationSchema(attr, verb, isArray) {
    const resultItem = {};
    for (const key in attr) {
      if (attr.hasOwnProperty(key)) {
        if (this.AttributeMap[verb][key] || key.indexOf('is') === 0) {
          if (key === 'type') {
            const name = attr[key].name;
            Object.assign(resultItem, this.setValidatorType(isArray ? `Array${name}` : name, attr.optional));

            if (!resultItem['custom']) {
              resultItem['custom'] = {};
            }
            resultItem['custom']['options'] = () => ({ type: name });
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

            if (object) {
              for (const subKey in object) {
                if (object.hasOwnProperty(subKey) && object[subKey]) {
                  result[`${key}.*.${subKey}`] = this.formatValidationSchema(object[subKey], verb);
                }
              }
            } else {
              result[`${key}`] = this.formatValidationSchema(subObject, verb, isArray);
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
