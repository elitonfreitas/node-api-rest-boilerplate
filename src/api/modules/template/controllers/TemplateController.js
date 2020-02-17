'use strict';

const BaseController = require('../../../commons/BaseController');
const TemplateValidator = require('../validator/TemplateValidator');
const Template = require('../../../../models/Template.model');

class TemplateController extends BaseController {
  constructor() {
    super(Template, TemplateValidator);
  }
}

module.exports = new TemplateController();
