'use strict';

const dotenv = require('dotenv');
dotenv.config({ path: './config/local.env' });
const request = require('supertest');
const App = require('src/App');
const Messages = require('src/commons/constants/Messages');
const HttpStatusCode = require('src/commons/constants/HttpStatusCode');
const UserModel = require('src/api/modules/users/models/User.model');

class BaseIntegrationTest {
  constructor(describe, Model = UserModel) {
    this.describe = describe;
    this.request = request;
    this.Messages = Messages;
    this.HttpStatusCode = HttpStatusCode;
    this.Model = Model;
    this.app = {};
    process.env.DB_HOST = process.env.MONGO_URL;
    process.env.CORS_ORIGIN = '*';
    this.rootPath = process.env.ROOT_API_PATH;
  }

  test() {}

  run() {
    const descName = this.describe || 'Integration test';

    describe(descName, () => {
      beforeAll(async () => {
        this.app = await new App().start();
        await this.Model.deleteMany({});
      });

      afterAll(async () => {
        await this.Model.deleteMany({});
        this.app.close();
      });

      this.test();
    });
  }
}

module.exports = BaseIntegrationTest;
