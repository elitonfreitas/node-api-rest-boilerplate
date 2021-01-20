'use strict';

const HttpController = require('../HttpController');

class AclMiddleware extends HttpController {
  constructor() {
    super();
    this.process = this.process.bind(this);
  }

  _checkACLToken(req, res, next) {
    const aclPermissions = {
      GET: ['r', 'w', 'm'],
      HEAD: ['r', 'w', 'm'],
      OPTIONS: ['r', 'w', 'm'],
      POST: ['w', 'm'],
      PUT: ['w', 'm'],
      PATCH: ['w', 'm'],
      DELETE: ['m'],
    };
    const rootPath = process.env.ROOT_API_PATH;
    const { originalUrl, method, token } = req;
    const { acl } = token;
    const resource = originalUrl.replace(rootPath, '').split('/')[1];
    const permission = !!acl && !!resource && acl[resource];

    if (!permission || !aclPermissions[method].includes(permission)) {
      return this.responseError(res, next, this.Messages.INVALID_ACL, {}, this.HttpStatusCode.UNAUTHORIZED);
    }
    next();
  }

  process(req, res, next) {
    if (req.token && JSON.parse(process.env.USE_ACL || 'false')) {
      this._checkACLToken(req, res, next);
    } else {
      next();
    }
  }

  initialize() {
    return this.process;
  }
}

module.exports = new AclMiddleware();
