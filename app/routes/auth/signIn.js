'use strict';

const accountService = require('../../service/accountService');
const CustomError = require('../../../lib/Errors/CustomError');
const { messages, httpMethods: { POST } } = global;

module.exports = new Map([
    [
        POST,
        {
            validator: async (args) => {
                if (!args.username || !args.password) {
                    throw new CustomError({
                        key: messages.missionParameters,
                        statusCode: 403,
                    });
                }
            },
            handler: async (args) => {
                const result = await accountService.signIn(args);
                return (result);
            },
        },
    ],
]);
