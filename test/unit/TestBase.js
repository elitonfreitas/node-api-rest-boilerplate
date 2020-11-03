'use strict';

const dotenv = require('dotenv');
dotenv.config({ path: './config/local.env' });
const mongoose = require('mongoose');
const sinon = require('sinon');
const Messages = require('src/commons/constants/Messages');

class TestBase {
  constructor(path, isModel, newInstance, Model, Validator) {
    this.restoreMethods = [];
    this.stub = sinon.stub;
    this.Messages = Messages;
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

    this.req = {
      query: {},
      body: {},
      params: { id: 1 },
      headers: { locale: 'en' }
    };

    this.expectedResponse = {
      message: 'Operation successfully performed',
      data: { _id: 1 }
    };
    this.expectedResponsePager = {
      message: 'Operation successfully performed',
      data: { list: [{ _id: 1 }], pager: { current: 1, limit: 10, total: 1 } }
    };
    this.expectedErrorResponse = {
      message: 'No results found',
      data: {}
    };

    this.initialize();
  }

  initialize() {
    this.status = sinon.stub();
    this.json = sinon.spy();
    this.res = {};
    this.res.set = () => {};
    this.res.download = (path, cb) => cb(null);
    this.res.status = this.status;
    this.res.json = this.json;
    this.status.returns(this.res);
    this.res.req = this.req;
    this.methods = {
      select: function() {
        return this;
      },
      lean: function() {
        return this;
      },
      where: function() {
        return this;
      },
      nin: function() {
        return this;
      },
      in: function() {
        return this;
      },
      or: function() {
        return this;
      },
      and: function() {
        return this;
      },
      populate: function() {
        return this;
      },
      distinct: function() {
        return this;
      },
      skip: function() {
        return this;
      },
      limit: function() {
        return this;
      },
      sort: function() {
        return this;
      },
      aggregate: function() {
        return this.Promise.resolve();
      },
      count: function() {
        return {
          exec: function() {
            return this.Promise.resolve(1);
          }
        };
      },
      countDocuments: function() {
        return {
          exec: function() {
            return this.Promise.resolve(1);
          }
        };
      },
      exec: function() {
        return this.Promise.resolve();
      }
    };
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

      if (this.isModel) {
        beforeAll(async () => {
          try {
            this.connection = await mongoose.connect(process.env.MONGO_URL, {
              useNewUrlParser: true,
              useCreateIndex: true,
              useUnifiedTopology: true,
              useFindAndModify: false
            });
          } catch (error) {
            console.error(err);
            process.exit(1);
          }
        });

        afterAll(async () => {
          await this.connection.close();
        });
      }

      this.test();
    });
  }
}

module.exports = TestBase;
