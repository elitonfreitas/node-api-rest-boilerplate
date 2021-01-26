'use strict';

const Messages = require('src/commons/constants/Messages');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  name: {
    type: String,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED,
  },
  aclResource: {
    type: String,
    required: true,
    index: true,
    errorMessage: Messages.FIELD_REQUIRED,
  },
  defaultPermission: {
    type: String,
    default: 'r',
    optional: true,
  },
});

module.exports = mongoose.model('Resource', ResourceSchema);
