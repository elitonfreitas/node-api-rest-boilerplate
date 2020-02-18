'use strict';

const BaseController = require('../../../commons/BaseController');
const Template = require('../../../../models/Template.model');

class TemplateController extends BaseController {
  constructor() {
    super(Template);
  }
}

module.exports = new TemplateController();
