'use strict';

const Base = require('./Base');

class Routes extends Base {
  constructor() {
    super();
    this.rootPath = process.env.ROOT_API_PATH || '/api';
  }

  getVerbs() {
    return ['options', 'get', 'post', 'put', 'patch', 'delete', 'head', 'ws', 'wss'];
  }

  generate(app, route) {
    const path = this.rootPath + route.path;
    const controller = route.controller;

    this.getVerbs().forEach(vrb => {
      vrb = route.verb ? route.verb : vrb;
      const method = route.method ? route.method : vrb;

      if (controller[method]) {
        app[vrb](path, async (req, res, next) => {
          this._logRequest(req);
          try {
            await controller[method](req, res, next);
          } catch (error) {
            controller.responseError(res, next, error.message);
          }
        });
      }
    });
    return app;
  }

  _logRequest(req) {
    const body = req.method + ' | Request => Body: ' + JSON.stringify(req.body);
    const query = '| Query: ' + JSON.stringify(req.query);
    const params = '| Params: ' + JSON.stringify(req.params);
    this.log.debug(body, params, query);
  }
}

module.exports = new Routes();
