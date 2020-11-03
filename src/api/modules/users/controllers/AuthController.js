'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BaseController = require('../../../../commons/BaseController');
const User = require('../models/User.model');

class AuthController extends BaseController {
  constructor() {
    super();
    this.secret = process.env.JWT_SECRET || 'teste';
    this.tokenDuration = process.env.JWT_DURATION || '1h';
  }

  async post(req) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, '+password name _id').lean();
    if (!user) {
      throw new Error(this.Messages.INVALID_LOGIN);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      delete user.password;
      const token = jwt.sign({ data: { user } }, this.secret, { expiresIn: this.tokenDuration });
      return { token };
    } else {
      throw new Error(this.Messages.INVALID_LOGIN);
    }
  }
}

module.exports = new AuthController();
