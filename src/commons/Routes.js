'use strict';

const { checkSchema, validationResult } = require('express-validator');

const Base = require('./Base');

class Routes extends Base {
  constructor() {
    super();
    this.rootPath = process.env.ROOT_API_PATH || '/api';
    this.httpVerbs = ['options', 'get', 'post', 'put', 'patch', 'delete', 'head', 'ws', 'wss'];
    this.httpValidateVerbs = ['post', 'put'];
  }

  generate(app, route) {
    const path = this.rootPath + route.path;
    const controller = route.controller;
    // const allowedMethods = Object.getOwnPropertyNames(controller.__proto__).filter(i => i !== 'constructor' && i.slice(0, 1) !== '_');

    this.httpVerbs.forEach(httpVerb => {
      const verb = route.verb || httpVerb;
      const method = route.method || httpVerb;

      if (controller[method]) {
        controller.Validator = controller.Validator || {};
        if (this.httpValidateVerbs.includes(verb) && controller.Model) {
          if (!controller.Validator[verb]) {
            controller.Validator[verb] = this.ValidatorUtils.getValidationSchema(controller.Model, verb);
          }
        } else {
          controller.Validator[verb] = {};
        }

        app[verb](path, checkSchema(controller.Validator[verb]), async (req, res, next) => {
          const locale = req.headers.locale || 'en';

          try {
            this.logRequest(req);
            const validations = validationResult(req);

            if (!validations.errors.length) {
              await controller[method](req, res, next);
            } else {
              controller.responseError(res, next, this.getValidatorErrors(validations.errors, locale));
            }
          } catch (error) {
            controller.responseError(res, next, this.normalizeMongoErrors(error, locale));
          }
        });
      }
    });
    return app;
  }

  getErrorFieldName(message) {
    if (typeof message === 'string' && message.includes('index:')) {
      let parts = message.split('index:');
      parts = parts[parts.length - 1].trim();
      parts = parts.split('_1');
      return parts[0];
    }
    return message;
  }

  normalizeMongoErrors(error, locale = 'pt-br') {
    if (error.message.includes('E11000 duplicate')) {
      const name = this.getErrorFieldName(error.message);
      error.message = this.t.__({ phrase: this.Messages.DUPLICATED, locale }, { name });
    }
    return error.message;
  }

  getValidatorErrors(errors, locale = 'pt-br') {
    errors = Array.isArray(errors) ? errors : undefined;
    const messages = [];

    if (errors) {
      errors.forEach(err => {
        const text = this.t.__({ phrase: err.msg, locale }, { param: '{{param}}' });
        messages.push(this.t.__(text, err));
      });
    }

    return messages.join('. ');
  }
}

module.exports = new Routes();
