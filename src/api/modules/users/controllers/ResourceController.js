'use strict';

const BaseController = require('src/commons/BaseController');
const ResourceModel = require('../models/Resource.model');

class UserController extends BaseController {
  constructor() {
    super(ResourceModel);
  }
}

module.exports = new UserController();
