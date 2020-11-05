'use strict';

const http = require('http');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const Base = require('./commons/Base');
const routes = require('./commons/Routes');
const HttpController = require('./commons/HttpController');
const MongoController = require('./commons/MongoController');
const JwtMiddleware = require('./commons/middlewares/JwtMiddleware');

class Api extends Base {
  async start() {
    const cors = require('cors');
    const app = express();

    try {
      await new MongoController().connect();
    } catch (error) {
      this.log.error('Error to mongodb:', error.message);
    }

    const httpController = new HttpController();
    const rootPath = process.env.ROOT_API_PATH || '/api';

    const corsOptions = {
      origin: process.env.CORS_ORIGIN ? new RegExp(process.env.CORS_ORIGIN, 'ig') : false
    };

    app.use(cors(corsOptions));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '15mb' }));

    if (process.env.USE_JWT_AUTH === 'true') {
      app.use(JwtMiddleware.initialize());
    }

    const dirModules = `${__dirname}/api/modules`;
    fs.readdirSync(dirModules).forEach(file => {
      require(`${dirModules}/${file}/`).forEach(route => {
        routes.generate(app, route);
      });
    });

    app.use((req, res, next) => {
      httpController.logRequest(req);
      httpController.responseError(res, next, new Error('Route not found'), {}, 404);
    });

    const server = http.createServer(app);
    const port = process.env.PORT || 3000;

    server.listen(port, () => {
      this.log.info(`Server ready on path: ${port}${rootPath}`);
    });
  }
}

new Api().start();
