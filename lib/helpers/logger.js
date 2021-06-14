'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');
const { LOG_PATH: logPath } = require('../../config/config');

const COLORS = {
    info: '\x1b[1;37m',
    debug: '\x1b[1;33m',
    warning: '\x1b[1;33m',
    error: '\x1b[0;31m',
    system: '\x1b[1;34m',
    access: '\x1b[1;36m',
};

const DATETIME_LENGTH = 19;

class Logger {
    constructor(fileName) {
        this.path = logPath;
        const filePath = path.join(logPath, `${fileName}.log`);
        this.stream = fs.createWriteStream(filePath, { flags: 'a' });
        this.regexp = new RegExp(path.dirname(this.path), 'g');
    }

    close() {
        return new Promise(resolve => this.stream.end(resolve));
    }

    write(level = 'info', s) {
        const now = new Date().toISOString();
        const date = now.substring(0, DATETIME_LENGTH);
        const color = COLORS[level];
        const line = `${date}\t${s}`;
        console.log(`${color + line}\x1b[0m`);
        const out = `${line.replace(/[\n\r]\s*/g, '; ')}\n`;
        this.stream.write(out);
    }

    log(...args) {
        const msg = util.format(...args);
        this.write('info', msg);
    }

    info(...args) {
        this.log(...args);
    }

    warn(...args) {
        const msg = util.format(...args);
        this.write('debug', msg);
    }

    error(...args) {
        const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
        this.write('error', msg.replace(this.regexp, ''));
    }

    system(...args) {
        const msg = util.format(...args);
        this.write('system', msg);
    }

    access(...args) {
        const msg = util.format(...args);
        this.write('access', msg);
    }
}

const LoggerFabric = (fileName) => {
    if (!fileName) {
        return LoggerFabric;
    }
    if (LoggerFabric.map.has(fileName)) {
        return LoggerFabric.map.get(fileName);
    }
    const newLogger = new Logger(fileName);
    LoggerFabric.map.set(fileName, newLogger);
    return newLogger;
};

LoggerFabric.map = new Map();

// module.exports = (function (fileName) {
//     if (Logger.map.has(fileName)) {
//         return Logger.map.get(fileName);
//     }
//     const newLogger = new Logger(fileName);
//     Logger.map.set(fileName, newLogger);
//     return newLogger;
// }());

module.exports = LoggerFabric;
