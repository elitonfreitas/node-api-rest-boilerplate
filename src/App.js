'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const Base = require('./commons/Base');
const routes = require('./commons/Routes');
const HttpController = require('./commons/HttpController');
const MongoController = require('./commons/MongoController');
const JwtMiddleware = require('./commons/middlewares/JwtMiddleware');
const HttpStatusCode = require('./commons/constants/HttpStatusCode');

class App extends Base {
  connectMongo() {
    return new MongoController().connect();
  }

  async createProfiles() {
    const ProfileModel = require('src/api/modules/users/models/Profile.model');
    const profiles = require('src/seed/profiles');
    const profilesExists = await ProfileModel.find({});
    if (!profilesExists.length) {
      await ProfileModel.insertMany(profiles);
      this.log.info(`Creating ${profiles.length} default user profiles`);
    }
  }

  async initMiddlewares(app) {
    const corsOptions = {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    };

    app.use((req, res, next) => {
      res.startTime = new Date();
      res.id = uuidv4();
      next();
    });

    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT }));

    if (process.env.USE_JWT_AUTH === 'true') {
      app.use(JwtMiddleware.initialize());

      if (JSON.parse(process.env.USE_ACL || 'false')) {
        await this.createProfiles();
      }
    }
  }

  initRoutes(app) {
    const dirModules = `${__dirname}/api/modules`;
    fs.readdirSync(dirModules).forEach(file => {
      require(`${dirModules}/${file}/`).forEach(route => {
        routes.generate(app, route);
      });
    });
  }

  defaultRoute(app) {
    const httpController = new HttpController();
    const healthCheckEndpoint = process.env.HEALTH_CHECK_ENDPOINT || '/healthcheck';
    app.use(healthCheckEndpoint, (req, res, next) => {
      httpController.response(
        res,
        next,
        { uptimeMilliseconds: new Date() - this.serviveStartTime, status: 'OK' },
        this.Messages.SUCCESS,
        HttpStatusCode.OK
      );
    });

    app.use((req, res, next) => {
      httpController.logRequest(req, res);
      httpController.responseError(res, next, new Error('Route not found'), {}, HttpStatusCode.NOT_FOUND);
    });
  }

  initServer(app) {
    const rootPath = process.env.ROOT_API_PATH;
    const port = process.env.PORT;

    return app.listen(port, () => {
      this.log.info(`Server ready on path: ${port}${rootPath}`);
    });
  }

  async start() {
    this.serviveStartTime = new Date();
    const app = express();
    await this.connectMongo();
    await this.initMiddlewares(app);
    this.initRoutes(app);
    this.defaultRoute(app);
    return this.initServer(app);
  }
}

module.exports = App;
