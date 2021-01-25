'use strict';

const BaseController = require('src/commons/BaseController');
const ProfileModel = require('../models/Profile.model');

class UserController extends BaseController {
  constructor() {
    super(ProfileModel);
  }
}

module.exports = new UserController();
