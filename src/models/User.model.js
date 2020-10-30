'use strict';

const bcrypt = require('bcryptjs');
const Messages = require('../commons/constants/Messages');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  _id: false,
  address: {
    type: String,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED,
    upRequired: true,
    upErrorMessage: Messages.FIELD_REQUIRED
  },
  number: { type: String },
  postCode: { type: String },
  neighborhood: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String }
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    indexe: true,
    errorMessage: Messages.FIELD_REQUIRED
  },
  email: {
    type: String,
    required: true,
    unique: true,
    errorMessage: Messages.FIELD_REQUIRED
  },
  password: {
    type: String,
    select: false,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED
  },
  addresses: [AddressSchema],
  level: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

function getHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

UserSchema.pre('save', function(next) {
  if (this._doc.password) {
    this._doc.password = getHash(this._doc.password);
  }
  next();
});

UserSchema.post('save', function(doc, next) {
  if (doc._doc.password) {
    delete doc._doc.password;
  }
  next();
});

UserSchema.pre('findOneAndUpdate', { document: true }, function(next) {
  if (this._update.$set.password) {
    this._update.$set.password = getHash(this._update.$set.password);
  }
  next();
});

module.exports = mongoose.model('users', UserSchema);
