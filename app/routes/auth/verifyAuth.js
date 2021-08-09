'use strict';

const accountService = require('../../service/accountService');
const { isAuthenticated } = require('../../middlewares');
const { POST } = global.httpMethods;

module.exports = new Map([
    [
        POST,
        {
            middleware: [isAuthenticated],
            handler: async (args) => {
                console.log(global.httpMethods.POST);
                const result = await accountService.signInByToken(args);
                return result;
            },
        },
    ],
]);
