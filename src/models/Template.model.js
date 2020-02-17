'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  _id: false,
  name: { type: String },
  description: { type: String },
  filePath: { type: String }
});

const TemplateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  description: { type: String },
  images: [ImageSchema],
  templatePath: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('templates', TemplateSchema);
