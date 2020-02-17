'use strict';

const http = require('http');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

const logger = require('./commons/Logger');
const routes = require('./commons/Routes');
const HttpController = require('./commons/HttpController');

const httpController = new HttpController();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '15mb' }));

const dirModules = `${__dirname}/api/modules`;
fs.readdirSync(dirModules).forEach(file => {
  require(`${dirModules}/${file}/`).forEach(route => {
    routes.generate(app, route);
  });
});

app.use((req, res, next) => {
  httpController.responseError(res, next, new Error('Route not found'), {}, 404);
});

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  logger.info(`Server ready on port: ${port}`);
});
