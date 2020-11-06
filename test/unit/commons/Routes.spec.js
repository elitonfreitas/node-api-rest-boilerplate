'use strict';
const { Express } = require('jest-express/lib/express');
const TestBase = require('test/unit/TestBase');
const UserModel = require('src/api/modules/users/models/User.model');

class RoutesTest extends TestBase {
  constructor() {
    super('src/commons/Routes');
  }

  test() {
    let app = new Express();
    beforeEach(() => {
      app = new Express();
    });
    afterEach(() => {
      app.resetMocked();
    });

    it('should generate route for get', () => {
      const route = {
        path: '/test',
        controller: {
          get: (req, res, next) => {},
          responseError: () => {},
          disabledMethods: [],
        },
      };
      expect(this.controller.generate(app, route)).toHaveProperty('get');
    });

    it('should generate route for post', () => {
      const route = {
        path: '/test',
        controller: {
          Model: UserModel,
          post: (req, res, next) => {},
          responseError: () => {},
          disabledMethods: [],
        },
      };
      expect(this.controller.generate(app, route)).toHaveProperty('post');
    });

    it('should generate route for post with validator error', () => {
      const route = {
        path: '/test',
        controller: {
          Validator: {
            post: {
              name1: {
                notEmpty: true,
              },
            },
          },
          post: (req, res, next) => {},
          responseError: () => {},
          disabledMethods: [],
        },
      };
      expect(this.controller.generate(app, route)).toHaveProperty('post');
    });

    it('should get field name from error message', () => {
      const message = 'test erro message index: name_1 text';
      expect(this.controller.getErrorFieldName(message)).toEqual('name');
    });

    it('should not get field name from error message', () => {
      const message = 'test erro message index name_1 text';
      expect(this.controller.getErrorFieldName(message)).toEqual(message);
    });

    it('should get field name from error message', () => {
      const message = new Error('E11000 duplicate test erro message index: name_1 text');
      expect(this.controller.normalizeMongoErrors(message)).toEqual('O valor do campo "name" já existe');
    });

    it('should get validator error messages', () => {
      const message = [
        {
          msg: 'Field "{{param}}" is required',
        },
      ];
      expect(this.controller.getValidatorErrors(message)).toEqual('O campo "" é obrigatório');
    });
  }
}

new RoutesTest().run();
