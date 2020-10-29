'use strict';

const _ = require('lodash');
const timezone = process.env.TZ || 'America/Sao_Paulo';
const moment = require('moment-timezone');
moment.tz.setDefault(timezone);

class DataUtils {
  getDateFormat(date) {
    const patterns = [
      'YYYY-MM-DD[T]HH:mm:ss.SSSZZ',
      'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
      'YYYY-MM-DD',
      'YYYY-MM-DD[T]HH:mm:ss',
      'DD/MM/YYYY HH:mm:ss',
      'DD/MM/YYYY HH:mm',
      'YYYY-MM-DD[T]HH:mm',
      'DD/MM/YYYY'
    ];

    for (const pattern of patterns) {
      if (moment(date, pattern, true).isValid()) {
        return pattern;
      }
    }

    return 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';
  }

  format(data, type) {
    switch (type) {
      case 'Date':
        {
          const format = this.getDateFormat(data);
          if (moment(data, format, true).isValid()) {
            data = moment(data, format).toISOString(true);
          }
        }
        break;
      case 'Number':
        data = isNaN(Number(data)) ? data : Number(data);
        break;
      case 'Boolean':
        data = Boolean(JSON.parse(data));
        break;
    }

    return data;
  }

  getFieldsOfSchema(model) {
    const object = model.schema ? model.schema.obj : model.obj;
    const fields = Object.keys(object);
    const result = [];

    for (const key of fields) {
      result.push({
        key: key,
        type: object[key].type ? object[key].type.name.toLowerCase() : undefined
      });
    }
    return result;
  }

  _getArrayValues(item, params, finalParams) {
    const key = item.split('*')[0].replace(/^\.+|\.+$/g, '');
    const subKey = item.split('*')[1];
    let value;

    if (params[key] && params[key].length) {
      for (let i = 0; i < params[key].length; i++) {
        value = _.get(params, `${key}.${i}${subKey}`);
        if (!finalParams[key]) {
          finalParams[key] = [{}];
        }
        if (value !== undefined) {
          _.set(finalParams, `${key}.${i}${subKey}`, value);
        }
      }
    } else if (params[key]) {
      finalParams[key] = [];
    }

    return finalParams;
  }

  normalize(params, fields) {
    const fieldNames = Object.keys(fields);
    let finalParams = {};

    if (fieldNames.length) {
      fieldNames.forEach(item => {
        const opt = fields[item].custom ? fields[item].custom.options() : {};
        let value;

        if (item.includes('*')) {
          finalParams = this._getArrayValues(item, params, finalParams);
        } else {
          value = _.get(params, item);
          if (!opt.remove && value !== undefined && !item.includes('*')) {
            if (opt.type && value) {
              finalParams[item] = this.format(value, opt.type);
            } else {
              finalParams[item] = value;
            }
          }
        }
      });
    }

    return finalParams;
  }
}

module.exports = new DataUtils();
