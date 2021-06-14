'use strict';

/**
 * Middleware Example. All data, returned from middleware will be joined to request payload.
 *
 * @param {Array} args Request arguments.
 * @param {Object} headers Request Object.
 */

module.exports = async (args, headers = {}) => {
    console.log(`Request headers: ${headers}`);
    console.log(`Request arguments: ${args.join()}`);
};
