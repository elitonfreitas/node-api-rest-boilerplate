'use strict';

const { Express } = require('jest-express/lib/express');
const TestBase = require('test/unit/TestBase');

class AppTest extends TestBase {
  constructor() {
    super('src/App', false, true);
  }

  test() {
    it('should call connect with MongoDB success', async () => {
      const spy = jest.spyOn(this.controller, 'connectMongo');
      const serverSpy = jest.spyOn(this.controller, 'initServer');
      await this.controller.start();
      expect(spy).toHaveBeenCalled();
      expect(serverSpy).toHaveBeenCalled();
      spy.mockReset();
      spy.mockRestore();
      serverSpy.mockReset();
      serverSpy.mockRestore();
    });

    it('should call connect with MongoDB error', async () => {
      const spy = jest.spyOn(this.controller, 'connectMongo').mockRejectedValue(new Error('MongoDB Connection error'));
      try {
        await this.controller.start();
      } catch (error) {
        expect(error.message).toBe('MongoDB Connection error');
      }
      spy.mockReset();
      spy.mockRestore();
    });

    it('should initialize express middlewares', async () => {
      const app = new Express();
      this.controller.initMiddlewares(app);
      expect(app.use).toHaveBeenCalled();
    });

    it('should initialize express middlewares without JWT', async () => {
      process.env.USE_JWT_AUTH = false;
      const app = new Express();
      this.controller.initMiddlewares(app);
      expect(app.use).toHaveBeenCalled();
    });

    it('should call default route', async () => {
      const app = new Express();
      this.controller.defaultRoute(app);
      expect(app.use).toHaveBeenCalled();
    });
  }
}

new AppTest().run();
