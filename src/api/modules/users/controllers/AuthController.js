'use strict';

const bcrypt = require('bcryptjs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const HttpController = require('src/commons/HttpController');
const User = require('../models/User.model');

class AuthController extends HttpController {
  constructor() {
    super();
    this.Model = User;
    this.disableValidator = true;
    this.secret = process.env.JWT_PRIVATE_KEY;
    this.tokenDuration = process.env.JWT_DURATION;
    this.algorithm = process.env.JWT_ALGORITHM;
  }

  async post(req) {
    const { email, password } = req.body;
    const user = await this.Model.findOne({ email }, '+password name _id').lean();
    if (!user) {
      throw new Error(this.Messages.INVALID_LOGIN);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      const iss = `${req.protocol}://${req.hostname}`;
      const sub = user._id;
      const jti = md5(req.ip + req.header('user-agent'));

      delete user.password;
      delete user._id;

      const token = jwt.sign({ user, iss, sub, jti }, this.secret, { expiresIn: this.tokenDuration, algorithm: this.algorithm });
      return { token };
    } else {
      throw new Error(this.Messages.INVALID_LOGIN);
    }
  }
}

module.exports = new AuthController();
