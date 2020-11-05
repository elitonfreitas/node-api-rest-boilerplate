'use strict';

const timezone = process.env.TZ || 'America/Sao_Paulo';
const moment = require('moment-timezone');
moment.tz.setDefault(timezone);

const winston = require('winston');
const { createLogger, format, transports } = winston;
const { levels, colors } = require('./constants/LogLevels');

class Logger {
  constructor() {
    this.initDefaults();
    this.setOptions();
  }

  initDefaults() {
    this.logLevel = 'debug';
    this.logLabel = 'REST-API';
    this.logEnable = 'true';
    this.logFileEnable = 'true';
    this.logOutput = 'printf';
    this.logFileName = `node-api-rest-${moment().format('YYYY-MM-DD')}.log`;
    this.transportsList = [];
    this.logPath = process.cwd() + '/logs/';
  }

  setOptions() {
    if (process.env.LOG_OUTPUT) this.logOutput = process.env.LOG_OUTPUT;
    if (process.env.LOG_LEVEL) this.logLevel = process.env.LOG_LEVEL;
    if (process.env.LOG_LEBEL) this.logLabel = process.env.LOG_LABEL;
    if (process.env.LOG_ENABLE) this.logEnable = process.env.LOG_ENABLE;
    if (process.env.LOG_FILE_ENABLE) this.logFileEnable = process.env.LOG_FILE_ENABLE;
    if (process.env.LOG_FILE_NAME) this.logFileName = `${process.env.LOG_FILE_NAME}${moment().format('YYYY-MM-DD')}.log`;
    if (process.env.LOG_PATH) this.logPath = process.cwd() + process.env.LOG_PATH;
  }

  formatCombined() {
    if (this.logOutput === 'json') {
      return format.combine(format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZZ' }), format.json());
    }

    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZZ' }),
      format.colorize(),
      format.printf(info => {
        const { timestamp, level, className, item, message, data } = info;
        const meta = Object.keys(data).length ? JSON.stringify(data) : '';
        return `${timestamp} ${level}: [${className}]${item ? ` [${item}]` : ''} ${message} ${meta ? `| data: ${meta}` : ''}`;
      })
    );
  }

  init() {
    winston.addColors(colors);

    if (this.logEnable == 'true') {
      if (this.logFileEnable == 'true') {
        const rotatedFileTransport = new transports.File({
          filename: this.logPath + this.logFileName,
          format: this.formatCombined(),
          level: this.logLevel
        });
        this.transportsList.push(rotatedFileTransport);
      }
      this.transportsList.push(
        new transports.Console({
          format: this.formatCombined(),
          level: this.logLevel
        })
      );

      return createLogger({
        levels: levels,
        format: this.formatCombined(),
        transports: this.transportsList,
        level: this.logLevel
      });
    } else {
      return {
        info: () => {},
        debug: () => {},
        error: () => {},
        warn: () => {}
      };
    }
  }
}

module.exports = new Logger().init();
