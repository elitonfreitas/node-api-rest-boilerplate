'use strict';

const BaseController = require('src/commons/BaseController');
const HttpError = require('src/commons/HttpError');
const ProfileModel = require('../models/Profile.model');

class UserController extends BaseController {
  constructor() {
    super(ProfileModel);
    this.disableValidator = true;
    this.Model = ProfileModel;
  }

  async put(req) {
    const data = req.body;
    if (data.length) {
      const promises = [];
      for (const profile of data) {
        if (profile.acl) {
          throw new HttpError(this.Messages.INVALID_PARAMS);
        }
        const _id = profile._id;
        delete profile._id;
        promises.push(this.Model.findOneAndUpdate({ _id }, { $set: profile }, { new: true, upsert: true }));
      }

      const result = await Promise.all(promises);

      if (result.length) {
        return {
          data: result,
          statusCode: this.HttpStatusCode.ACCEPTED,
        };
      } else {
        throw new HttpError(this.Messages.UPDATE_NOT_OCURRED, this.HttpStatusCode.NOT_FOUND);
      }
    } else {
      throw new HttpError(this.Messages.INVALID_PARAMS);
    }
  }
}

module.exports = new UserController();
