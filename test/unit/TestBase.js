'use strict';

const dotenv = require('dotenv');
dotenv.config({ path: './config/local.env' });
const mongoose = require('mongoose');
const sinon = require('sinon');
const HttpStatusCode = require('src/commons/constants/HttpStatusCode');
const Messages = require('src/commons/constants/Messages');

class TestBase {
  constructor(path, isModel, newInstance, Model, Validator) {
    this.restoreMethods = [];
    this.stub = sinon.stub;
    this.Messages = Messages;
    this.HttpStatusCode = HttpStatusCode;
    this.isModel = isModel;
    this.connection = null;
    this.mongoose = mongoose;

    if (path) {
      if (this.isModel) {
        this.Model = require(path);
      } else {
        if (newInstance) {
          const Controller = require(path);
          this.controller = new Controller(Model, Validator);
        } else {
          this.controller = require(path);
        }
      }
    }

    this.defaultReq = {
      ip: '127.0.0.1',
      query: {},
      body: {},
      params: { id: 1 },
      headers: { locale: 'en' },
      header: param => this.req.headers[param],
      baseUrl: '/',
    };

    this.expectedResponse = {
      message: 'Operation successfully performed',
      data: { _id: 1 },
    };
    this.expectedResponsePager = {
      message: 'Operation successfully performed',
      data: { list: [{ _id: 1 }], pager: { current: 1, limit: 10, total: 1 } },
    };
    this.expectedErrorResponse = {
      message: 'No results found',
      data: {},
    };

    this.initialize();
  }

  initialize() {
    this.status = sinon.stub();
    this.json = sinon.spy();
    this.res = {};
    this.res.set = () => {};
    this.res.setHeader = () => {};
    this.res.download = (path, cb) => cb(null);
    this.res.status = this.status;
    this.res.json = this.json;
    this.status.returns(this.res);
    this.res.req = this.defaultReq;
  }

  restore(method) {
    if (method) {
      this.restoreMethods.push(method);
    } else {
      this.restoreMethods.forEach(_method => {
        if (_method.restore) {
          _method.restore();
        }
      });
    }
  }

  test() {}

  run() {
    const descName = this.controller ? this.controller.constructor.name : `${this.Model.modelName} ${this.Model.name}`;

    describe(descName, () => {
      if (this.controller) {
        afterEach(() => this.restore());
      }

      beforeAll(async done => {
        try {
          this.req = this.defaultReq;

          if (this.Model || (this.controller && this.controller.Model)) {
            this.connection = await mongoose.connect(process.env.MONGO_URL, {
              useNewUrlParser: true,
              useCreateIndex: true,
              useUnifiedTopology: true,
              useFindAndModify: false,
            });
          }

          if (this.Model) {
            await this.Model.deleteMany({});
          }

          if (this.controller && this.controller.Model) {
            await this.controller.Model.deleteMany({});
          }
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
        done();
      });

      afterAll(async done => {
        if (this.connection && this.connection.close) {
          if (this.Model) {
            await this.Model.deleteMany({});
          }

          if (this.controller && this.controller.Model) {
            await this.controller.Model.deleteMany({});
          }
          await this.connection.close();
          this.connection = null;
        }
        done();
      });

      this.test();
    });
  }
}

module.exports = TestBase;
