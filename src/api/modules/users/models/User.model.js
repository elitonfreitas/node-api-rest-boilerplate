'use strict';

const bcrypt = require('bcryptjs');
const Messages = require('src/commons/constants/Messages');
const mongoose = require('mongoose');
require('./Profile.model');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      isEmail: {
        errorMessage: Messages.FIELD_EMAIL,
      },
      upOptional: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    password: {
      type: String,
      select: false,
      required: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    active: {
      type: Boolean,
      default: true,
      optional: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    options: { type: Object, default: {} },
    profiles: [
      {
        type: Number,
        ref: 'Profile',
        default: process.env.ACL_DEFAULT_PROFILE,
        optional: true,
      },
    ],
    acl: {
      type: Object,
      default: undefined,
      optional: true,
    },
  },
  {
    timestamps: true,
  }
);

if (JSON.parse(process.env.USE_ACL || 'false')) {
  UserSchema.pre('find', function () {
    if (!this._mongooseOptions.populate) {
      this.populate('profiles', 'name');
    }
  });

  UserSchema.pre('findOne', function () {
    if (!this._mongooseOptions.populate) {
      this.populate('profiles', 'name');
    }
  });
}

function getHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

UserSchema.path('password').set(function (v) {
  return getHash(v);
});

UserSchema.post('save', function (doc, next) {
  delete doc._doc.password;
  next();
});

module.exports = mongoose.model('users', UserSchema);
