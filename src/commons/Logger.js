'use strict';

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
    this.logEnable = 'true';
    this.logFileEnable = 'true';
    this.logFileName = 'linkedin-curriculum-%DATE%.log';
    this.transportsList = [];
    this.logLabel = 'LC';
    this.logPath = process.cwd() + '/logs/';
  }

  setOptions() {
    if (process.env.LOG_LEVEL) this.logLevel = process.env.LOG_LEVEL;
    if (process.env.LOG_ENABLE) this.logEnable = process.env.LOG_ENABLE;
    if (process.env.LOG_FILE_ENABLE) this.logFileEnable = process.env.LOG_FILE_ENABLE;
    if (process.env.LOG_FILE_NAME) this.logFileName = process.env.LOG_FILE_NAME;
    if (process.env.LOG_LABEL) this.logLabel = process.env.LOG_LABEL;
    if (process.env.LOG_PATH) this.logPath = process.env.LOG_PATH;
  }

  formatCombined() {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      format.label({
        label: this.logLabel
      }),
      format.align(),
      format.colorize(),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
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
    }
  }
}

module.exports = new Logger().init();
