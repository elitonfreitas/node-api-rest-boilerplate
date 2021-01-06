'use strict';

const BaseController = require('src/commons/BaseController');
const User = require('../models/User.model');

class UserController extends BaseController {
  constructor() {
    super(User);
  }
}

module.exports = new UserController();
