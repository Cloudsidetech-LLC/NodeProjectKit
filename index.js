'use strict';

const { PORT, STATIC_PATH, STATIC_SERVER_PORT } = require('./config/config');
const Logger = require('./lib/helpers/logger');
const dbConnect = require('./lib/dbConnect');
const http = require('./lib/listeners/http');
const staticHttp = require('./lib/listeners/static');

// Constants adder
require('./constants');

const routing = require('./app/routes');
const logger = Logger('main');

(async () => {
    try {
        await dbConnect();
    } catch (error) {
        logger.error('Error on connecting to DB.',error);
        process.exit(1);
    }
})();

// Server uncaught error handlers
process.on('uncaughtException', (err) => {
    console.log('An uncaught exception detected', err);
    process.exit(-1);
});

process.on('unhandledRejection', (err) => {
    console.log('An unhandled rejection detected', err);
    process.exit(-1);
});

http(routing, PORT);
staticHttp(STATIC_PATH, STATIC_SERVER_PORT);
