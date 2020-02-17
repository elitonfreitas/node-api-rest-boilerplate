'use strict';

const { checkSchema, validationResult } = require('express-validator');
const i18n = require('i18n');

const Base = require('./Base');

class Routes extends Base {
  constructor() {
    super();
    this.rootPath = process.env.ROOT_API_PATH || '/api';
  }

  getHttpVerbs() {
    return ['options', 'get', 'post', 'put', 'patch', 'delete', 'head', 'ws', 'wss'];
  }

  generate(app, route) {
    const path = this.rootPath + route.path;
    const controller = route.controller;
    // const allowedMethods = Object.getOwnPropertyNames(controller.__proto__).filter(i => i !== 'constructor' && i.slice(0, 1) !== '_');

    this.getHttpVerbs().forEach(httpVerb => {
      const verb = route.verb || httpVerb;
      const method = route.method || httpVerb;

      if (controller[method]) {
        let validator = {};
        if (controller.Validator && controller.Validator[method]) {
          validator = controller.Validator[method];
        }
        app[verb](path, checkSchema(validator), async (req, res, next) => {
          try {
            this.logRequest(req);
            const validations = validationResult(req);

            if (!validations.errors.length) {
              await controller[method](req, res, next);
            } else {
              const locale = req.headers.locale || 'en';
              controller.responseError(res, next, this.getValidatorErrors(validations.errors, locale));
            }
          } catch (error) {
            controller.responseError(res, next, error.message);
          }
        });
      }
    });
    return app;
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
