'use strict';

const mongoose = require('mongoose');
const { performance } = require('perf_hooks');

const Controller = require('./Controller');
mongoose.Promise = Promise;

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const dbName = process.env.DB_NAME || 'memcl';
const dbAuth = process.env.DB_AUTH || 0;
const dbAuthSrc = process.env.DB_AUTH_SRC || 'admin';
const dbReplicaOption = process.env.DB_REPLICA ? `replicaSet=${process.env.DB_REPLICA}&` : '';

class MongoController extends Controller {
  constructor() {
    super();
    this.mongoose = mongoose;
  }

  _getConnectionUrl() {
    let authentication = '';

    if (dbAuth == '1') {
      authentication = process.env.DB_USER + ':' + process.env.DB_PASS + '@';
    }
    if (dbReplicaOption) {
      return `mongodb://${authentication}${dbHost}/${dbName}?${dbReplicaOption}authSource=${dbAuthSrc}`;
    } else {
      return `mongodb://${authentication}${dbHost}:${dbPort}/${dbName}?authSource=${dbAuthSrc}`;
    }
  }

  _registerConnectionEvents() {
    mongoose.connection.once('open', () => {
      this.log.debug('MongoDB event open');
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
    mongoose.connection.close(() => {
      this.log.info('Mongoose disconnected through ' + msg);
      callback();
    });
  }

  async connect() {
    const connectionUrl = this._getConnectionUrl();

    this.log.debug(`DB_AUTH :: ${dbAuth}`);
    let logSafeUrl = '';
    if (dbAuth == '1') {
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

    try {
      await mongoose.connect(connectionUrl, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10,
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4
      });
      this.log.info('Connected to mongodb');
    } catch (error) {
      this.log.info('Error to mongodb:', error.message);
    }
  }

  async ping() {
    performance.mark('prestats');
    const stats = await mongoose.connection.db.stats();
    performance.mark('poststats');
    performance.measure('stats', 'prestats', 'poststats');
    const measure = performance.getEntriesByName('stats')[0];

    return { ok: stats.ok, time: measure.duration };
  }

  disconnect() {
    try {
      this.log.info('Disconnected from mongodb');
      return mongoose.disconnect();
    } catch (error) {
      this.log.err('Error on disconnected from mongodb:', error.message);
    }
  }
}

module.exports = MongoController;
