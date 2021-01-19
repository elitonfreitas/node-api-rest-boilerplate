'use strict';

const jwt = require('jsonwebtoken');
const md5 = require('md5');
const HttpController = require('../HttpController');

class JwtMiddleware extends HttpController {
  constructor() {
    super();
    this.process = this.process.bind(this);
    this.nextIfHasToken = this.nextIfHasToken.bind(this);
    this.rootApi = process.env.ROOT_API_PATH;
    this.noAuthRoutes = process.env.NO_AUTH_ROUTES ? process.env.NO_AUTH_ROUTES.split(';') : [];
    this.noTokenApis = [];
    this._getNoAuthRoutes();
  }

  _getNoAuthRoutes() {
    for (const route of this.noAuthRoutes) {
      const [path, methodsStr] = route.split('|');

      if (path) {
        const noAuthItem = { path };
        if (methodsStr) {
          noAuthItem.methods = methodsStr.split(',');
        }
        this.noTokenApis.push(noAuthItem);
      }
    }
  }

  nextIfHasToken(req, res, next) {
    if (req.token || this._checkNoAuthRoutes(req)) {
      next();
    }
  }

  _getTokenFromHeader(req) {
    const authorization = req.headers.authorization;
    const token = authorization ? authorization.split(/(\s+)/)[2] : '';
    return token;
  }

  _checkNoAuthRoutes(req) {
    const endpoint = req.originalUrl;
    for (const item of this.noTokenApis) {
      if (endpoint.includes(item.path) && (!item.methods || item.methods.includes(req.method))) {
        return true;
      }
    }
    return false;
  }

  _checkRequestToken(req, res, next) {
    try {
      const token = this._getTokenFromHeader(req);
      const tokenData = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
      const jti = md5(req.ip + req.header('user-agent'));

      if (tokenData.jti !== jti) {
        return this.responseError(res, next, this.Messages.INVALID_TOKEN_ORIGIN, {}, this.HttpStatusCode.NOT_ACCEPTABLE);
      }

      req.token = tokenData;
    } catch (error) {
      this.responseError(res, next, this.Messages.INVALID_TOKEN, {}, this.HttpStatusCode.UNAUTHORIZED);
    }
  }

  _checkACLToken(req, res, next) {
    const { originalUrl, method, token } = req;
    const { acl } = token;
    const resource = originalUrl.split('/')[2];
    const aclPart = acl[resource];
    let hasAuth = true;

    if (!aclPart) {
      hasAuth = false;
    } else {
      hasAuth = aclPart.includes(method.toLowerCase()) || aclPart.includes('*');
    }

    if (!hasAuth) {
      delete req.token;
      return this.responseError(res, next, this.Messages.INVALID_ACL, {}, this.HttpStatusCode.UNAUTHORIZED);
    }
  }

  process(req, res, next) {
    if (this._checkNoAuthRoutes(req)) {
      next();
    } else {
      this._checkRequestToken(req, res, next);

      if (req.token && JSON.parse(process.env.USE_ACL || 'false')) {
        this._checkACLToken(req, res, next);
      }

      if (req.token) {
        next();
      }
    }
  }

  initialize() {
    return this.process;
  }
}

module.exports = new JwtMiddleware();
