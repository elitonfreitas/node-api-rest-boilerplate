'use strict';

const Messages = require('../commons/constants/Messages');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  _id: false,
  name: {
    type: String,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED,
    upRequired: true,
    upErrorMessage: Messages.FIELD_REQUIRED
  },
  description: {
    type: String
  },
  filePath: {
    type: String,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED,
    upRequired: true,
    upErrorMessage: Messages.FIELD_REQUIRED
  }
});

const TemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    errorMessage: Messages.FIELD_REQUIRED
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED
  },
  description: {
    type: String,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED
  },
  images: [ImageSchema],
  templatePath: {
    type: String,
    required: true,
    errorMessage: Messages.FIELD_REQUIRED
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

module.exports = mongoose.model('templates', TemplateSchema);
