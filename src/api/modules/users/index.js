'use strict';

const controller = require('./controllers/UserController');

module.exports = [
  {
    path: '/users/:id',
    controller
  },
  {
    path: '/users',
    controller
  }
];
