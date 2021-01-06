'use strict';

const BaseController = require('src/commons/BaseController');
const UserModel = require('../models/User.model');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }
}

module.exports = new UserController();
