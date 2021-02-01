'use strict';

const bcrypt = require('bcryptjs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const HttpController = require('src/commons/HttpController');
const UserModel = require('../models/User.model');
const HttpError = require('src/commons/HttpError');

class AuthController extends HttpController {
  constructor() {
    super();
    this.Model = UserModel;
    this.disableValidator = true;
    this.secret = process.env.JWT_PRIVATE_KEY;
    this.tokenDuration = process.env.JWT_DURATION;
    this.algorithm = process.env.JWT_ALGORITHM;
  }

  async post(req) {
    const { email, password } = req.body;
    const useACL = JSON.parse(process.env.USE_ACL || 'false');
    const query = this.Model.findOne({ email, active: true }, '+password name _id profiles acl options');

    if (useACL) {
      query.populate({ path: 'profiles', select: '-_id name acl', options: { sort: { _id: -1 } } });
    }

    const user = await query.lean();

    if (!user) {
      throw new Error(this.Messages.INVALID_LOGIN);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      const iss = `${req.protocol}://${req.hostname}`;
      const sub = user._id;
      const jti = md5(req.ip + req.header('user-agent'));
      const { profiles } = user;
      let acl;
      const profileName = [];

      if (useACL && (profiles || user.acl)) {
        for (const profile of profiles) {
          acl = { ...acl, ...profile.acl };
          profileName.push(profile.name);
        }
        acl = { ...acl, ...user.acl };
      }

      delete user.password;
      delete user.profiles;
      delete user.acl;

      user.profiles = profileName.length ? profileName : undefined;

      const token = jwt.sign({ user, iss, sub, jti, acl }, this.secret, { expiresIn: this.tokenDuration, algorithm: this.algorithm });
      return { data: { token }, statusCode: this.HttpStatusCode.ACCEPTED };
    } else {
      throw new HttpError(this.Messages.INVALID_LOGIN, this.HttpStatusCode.UNAUTHORIZED);
    }
  }
}

module.exports = new AuthController();
