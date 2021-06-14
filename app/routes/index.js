'use strict';

const { routesPath } = require('../../constants/fileConstants');
const { dependencyInjectionMap } = require('../../lib/helpers');

const routing = dependencyInjectionMap(routesPath);

module.exports = routing;
