'use strict';

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
    const allowedMethods = Object.getOwnPropertyNames(controller.__proto__).filter(i => i !== 'constructor' && i.slice(0, 1) !== '_');

    this.getHttpVerbs().forEach(httpVerb => {
      const verb = route.verb || httpVerb;
      const method = route.method || httpVerb;

      if (allowedMethods.includes(method)) {
        app[verb](path, async (req, res, next) => {
          try {
            this.logRequest(req);
            await controller[method](req, res, next);
          } catch (error) {
            controller.responseError(res, next, error.message);
          }
        });
      }
    });
    return app;
  }
}

module.exports = new Routes();
