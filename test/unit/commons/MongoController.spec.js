'use strict';

const TestBase = require('test/unit/TestBase');

class MongoControllerTest extends TestBase {
  constructor() {
    super('src/commons/MongoController', false, true);
    this.dbName = process.env.DB_NAME;
  }

  test() {
    it('should get connection url without auth and replica set', () => {
      this.controller.dbAuth = '0';
      this.controller.dbReplicaOption = null;

      expect(this.controller._getConnectionUrl()).toEqual(`mongodb://127.0.0.1:27017/${this.dbName}?authSource=admin`);
    });

    it('should get connection url with auth without replica set', () => {
      this.controller.dbAuth = '1';
      this.controller.dbReplicaOption = null;

      expect(this.controller._getConnectionUrl()).toEqual(`mongodb://root:test@127.0.0.1:27017/${this.dbName}?authSource=admin`);
    });

    it('should get connection url with replica set', () => {
      this.controller.dbAuth = '1';
      this.controller.dbReplicaOption = `replicaSet=rs&`;

      expect(this.controller._getConnectionUrl()).toEqual(`mongodb://root:test@127.0.0.1/${this.dbName}?replicaSet=rs&authSource=admin`);
    });

    it('should connect with Mongo', async () => {
      this.stub(this.controller.mongoose, 'connect').returns(Promise.resolve(true));
      this.restore(this.controller.mongoose.connect);
      expect(await this.controller.connect()).toBe(true);
    });

    it('should connect with Mongo error', async () => {
      this.controller.dbAuth = '0';
      this.stub(this.controller.mongoose, 'connect').returns(Promise.reject(new Error('teste')));
      try {
        await this.controller.connect();
      } catch (error) {
        expect(error.message).toEqual('teste');
      }
    });

    it('should disconnect with Mongo', async () => {
      this.stub(this.controller.mongoose, 'disconnect').returns(Promise.resolve(true));
      this.restore(this.controller.mongoose.disconnect);
      expect(await this.controller.disconnect()).toBe(true);
    });

    it('should disconnect with Mongo error', async () => {
      this.stub(this.controller.mongoose, 'disconnect').returns(Promise.reject(new Error('teste')));

      try {
        await this.controller.disconnect();
      } catch (error) {
        expect(error.message).toEqual('teste');
      }
    });
  }
}

new MongoControllerTest().run();
