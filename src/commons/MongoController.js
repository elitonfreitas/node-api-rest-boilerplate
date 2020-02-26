'use strict';

const mongoose = require('mongoose');
const Controller = require('./Controller');

class MongoController extends Controller {
  constructor() {
    super();
    this.mongoose = mongoose;
    this.dbHost = process.env.DB_HOST || 'localhost';
    this.dbPort = process.env.DB_PORT || '27017';
    this.dbName = process.env.DB_NAME || 'restapi-local';
    this.dbAuth = process.env.DB_AUTH || 0;
    this.dbAuthSrc = process.env.DB_AUTH_SRC || 'admin';
    this.dbUser = process.env.DB_USER || 'root';
    this.dbPass = process.env.DB_PASS || '';
    this.dbReplicaOption = process.env.DB_REPLICA ? `replicaSet=${process.env.DB_REPLICA}&` : '';
  }

  _getConnectionUrl() {
    let authentication = '';

    if (this.dbAuth == '1') {
      authentication = this.dbUser + ':' + this.dbPass + '@';
    }
    if (this.dbReplicaOption) {
      return `mongodb://${authentication}${this.dbHost}/${this.dbName}?${this.dbReplicaOption}authSource=${this.dbAuthSrc}`;
    } else {
      return `mongodb://${authentication}${this.dbHost}:${this.dbPort}/${this.dbName}?authSource=${this.dbAuthSrc}`;
    }
  }

  _registerConnectionEvents() {
    this.mongoose.connection.once('open', () => {
      this.log.info('MongoDB connected');
      mongoose.connection.on('disconnected', () => this.log.info('MongoDB disconnected'));
      mongoose.connection.on('reconnected', () => this.log.info('MongoDB event reconnected'));
      mongoose.connection.on('error', err => this.log.info(`MongoDB event error: ${err}`));
    });
  }

  _getLogSafeUrl(connectionUrl) {
    let logSafeUrl = '';
    const urlArr = connectionUrl.split(':');
    const passwordChunkArr = urlArr[2].split('@');
    passwordChunkArr[0] = 'xxxxxx';
    urlArr[2] = passwordChunkArr.join('@');
    logSafeUrl = urlArr.join(':');
    return logSafeUrl;
  }

  _gracefulShutdown(msg, callback) {
    this.mongoose.connection.close(() => {
      this.log.info('Mongoose disconnected through ' + msg);
      callback();
    });
  }

  async connect() {
    const connectionUrl = this._getConnectionUrl();

    this.log.debug(`DB_AUTH :: ${this.dbAuth}`);
    let logSafeUrl = '';
    if (this.dbAuth == '1') {
      logSafeUrl = this._getLogSafeUrl(connectionUrl);
    } else {
      logSafeUrl = connectionUrl;
    }

    this.log.info(`Connecting to mongo url: ${logSafeUrl}`);
    this._registerConnectionEvents();

    process.on('SIGINT', () => {
      this._gracefulShutdown('API termination', () => {
        process.exit(0);
      });
    });

    return mongoose.connect(connectionUrl, {
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10,
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
  }

  disconnect() {
    return mongoose.disconnect();
  }
}

module.exports = MongoController;
