'use strict';

const Messages = require('src/commons/constants/Messages');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    name: {
      type: String,
      required: true,
      index: true,
      errorMessage: Messages.FIELD_REQUIRED,
    },
    acl: {
      type: Object,
      required: true,
      default: {},
      errorMessage: Messages.FIELD_REQUIRED,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', ProfileSchema);
