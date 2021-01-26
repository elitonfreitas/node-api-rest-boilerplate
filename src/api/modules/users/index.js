'use strict';

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const ProfileController = require('./controllers/ProfileController');
const ResourceController = require('./controllers/ResourceController');

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
  {
    path: '/profiles',
    controller: ProfileController,
  },
  {
    path: '/resources',
    controller: ResourceController,
  },
];
