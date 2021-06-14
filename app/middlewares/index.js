'use strict';

const { middlewarePath } = require('../../constants/fileConstants');
const { dependencyInjection } = require('../../lib/helpers');

const middlewares = dependencyInjection(middlewarePath);

module.exports = middlewares;
