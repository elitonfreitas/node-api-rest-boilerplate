'use strict';

const controller = require('./controllers/AuthController');

module.exports = [
  {
    path: '/auth',
    controller
  }
];
