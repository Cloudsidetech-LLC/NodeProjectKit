'use strict';

const { constatsPath } = require('./fileConstants');
const { dependencyInjection } = require('../lib/helpers/index');

dependencyInjection(constatsPath, global);
