'use strict';

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');

module.exports = [
  {
    path: '/users/:id',
    controller: UserController,
  },
  {
    path: '/users',
    controller: UserController,
  },
  {
    path: '/auth',
    controller: AuthController,
  },
];
