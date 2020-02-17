'use strict';

const controller = require('./controllers/TemplateController');

module.exports = [
  {
    path: '/template/:id',
    controller
  },
  {
    path: '/template',
    controller,
    method: 'getAll',
    verb: 'get'
  }
];
