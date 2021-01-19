'use strict';

const bcrypt = require('bcryptjs');
const Messages = require('src/commons/constants/Messages');
const mongoose = require('mongoose');
require('./Profile.model');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  _id: false,
  address: {
    type: String,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED,
    upRequired: true,
    upErrorMessage: Messages.FIELD_REQUIRED,
  },
  number: { type: String },
  postCode: { type: String },
  neighborhood: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
});

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
      required: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    addresses: [AddressSchema],
    profile: {
      type: Number,
      ref: 'Profile',
      default: process.env.ACL_DEFAULT_PROFILE,
      optional: true,
    },
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
