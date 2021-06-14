/**
 * Connection to Database. MongoDB + Mongoose example.
 */

/*
const mongoose = require('mongoose');
const logger = require('./helpers/logger')('main');
const { MONGO_URI } = require('../config/config');

module.exports = async () => {
    await mongoose.connect(MONGO_URI, {
        readPreference: 'primary',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        socketTimeoutMS: 90000,
        keepAlive: 10000,
        connectTimeoutMS: 30000,
    }, () => logger.access('MongoDB connection established'));
};

*/
