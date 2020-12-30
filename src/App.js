'use strict';

const http = require('http');
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

class App extends Base {
  connectMongo() {
    return new MongoController().connect();
  }

  initMiddlewares(app) {
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
    app.use(bodyParser.json({ limit: '15mb' }));

    if (process.env.USE_JWT_AUTH === 'true') {
      app.use(JwtMiddleware.initialize());
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
    app.use((req, res, next) => {
      httpController.logRequest(req, res);
      httpController.responseError(res, next, new Error('Route not found'), {}, 404);
    });
  }

  initServer(app) {
    const rootPath = process.env.ROOT_API_PATH || '/api';
    const server = http.createServer(app);
    const port = process.env.PORT || 3000;

    server.listen(port, () => {
      this.log.info(`Server ready on path: ${port}${rootPath}`);
    });

    return server;
  }

  async start() {
    const app = express();
    await this.connectMongo();
    this.initMiddlewares(app);
    this.initRoutes(app);
    this.defaultRoute(app);
    this.initServer(app);
  }
}

module.exports = App;