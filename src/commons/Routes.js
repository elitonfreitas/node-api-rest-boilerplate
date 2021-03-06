'use strict';

const { checkSchema, validationResult } = require('express-validator');
const Base = require('./Base');

class Routes extends Base {
  constructor() {
    super();
    this.rootPath = process.env.ROOT_API_PATH;
    this.httpVerbs = process.env.USE_HTTP_VERBS ? process.env.USE_HTTP_VERBS.split(',') : ['options', 'get', 'post', 'put', 'delete']; // if need, includes: 'patch', 'head', 'ws', 'wss'
    this.httpValidateVerbs = process.env.VALIDATE_HTTP_VERBS ? process.env.VALIDATE_HTTP_VERBS.split(',') : ['post', 'put'];
  }

  generate(app, route) {
    const path = this.rootPath + route.path;
    const controller = route.controller;
    controller.Validator = controller.Validator || {};

    for (const httpVerb of this.httpVerbs) {
      const verb = route.verb || httpVerb;
      const method = route.method || httpVerb;

      if (controller[method] && !controller.disabledMethods.includes(method)) {
        if (this.httpValidateVerbs.includes(verb) && controller.Model && !controller.disableValidator) {
          if (!controller.Validator[verb]) {
            controller.Validator[verb] = this.ValidatorUtils.getValidationSchema(controller.Model, verb);
          }
        }

        app[verb](path, checkSchema(controller.Validator[verb] || {}), async (req, res, next) => {
          const locale = req.headers.locale || 'en';

          try {
            this.logRequest(req, res);
            const validations = validationResult(req);

            if (!validations.errors.length) {
              const response = await controller[method](req, res, next);
              const data = response.data ? response.data : response;
              const statusCode = response.statusCode || this.HttpStatusCode.OK;
              const message = response.message || this.Messages.SUCCESS;

              controller.response(res, next, data, message, statusCode);
            } else {
              controller.responseError(
                res,
                next,
                this.getValidatorErrors(validations.errors, locale),
                {},
                this.HttpStatusCode.PRECONDITION_FAILED
              );
            }
          } catch (error) {
            const { statusCode, data } = error;
            controller.responseError(res, next, this.normalizeMongoErrors(error, locale), data, statusCode);
          }
        });
      }
    }

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

  normalizeMongoErrors(error, locale = 'en') {
    if (error.message.includes('E11000 duplicate')) {
      const name = this.getErrorFieldName(error.message);
      error.message = this.t.__({ phrase: this.Messages.DUPLICATED, locale }, { name });
    }
    return error.message;
  }

  getValidatorErrors(errors, locale = 'en') {
    errors = Array.isArray(errors) ? errors : undefined;
    const messages = [];

    if (errors) {
      errors.forEach(err => {
        const text = this.t.__({ phrase: err.msg, locale }, { param: '{{param}}' });
        messages.push(this.t.__(text, err));
      });
    }

    return messages;
  }
}

module.exports = new Routes();
