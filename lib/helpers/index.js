'use strict';

const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const { dotJs, index } = require('../../constants/fileConstants');
const { emailRegexp } = global.parameters;

const dependencyInjectionMap = (pathToFolder, aggr = new Map()) => {
    const apiPath = path.join(process.cwd(), pathToFolder);

    const files = fs.readdirSync(apiPath);

    for (const fileName of files) {
        const destination = fs.statSync(path.join(apiPath, fileName));
        if (destination.isDirectory()) {
            const routing = dependencyInjectionMap(path.join(pathToFolder, fileName));
            aggr.set(fileName, routing);
        } else {
            if (!fileName.endsWith(dotJs) || fileName.startsWith(index)) continue;
            const filePath = path.join(apiPath, fileName);
            const serviceName = path.basename(fileName, dotJs);
            aggr.set(serviceName, require(filePath));
        }
    }

    return aggr;
};

module.exports = {
    receiveArgs: async (req) => {
        const { url } = req;
        const queryParams = qs.parse(url.split('?')[1]) || {};
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = JSON.parse(Buffer.concat(buffers).toString()) || {};
        return { ...data, ...queryParams };
    },

    middlewareRunner: async (args, middlewares, headers, cookies) => {
        let params = {};
        for await (const middleware of middlewares) {
            const middlewareResponse = await middleware(args, headers, cookies);
            params = { ...params, ...middlewareResponse };
        }
        return params;
    },

    dependencyInjection: (pathToFolder, aggr = {}) => {
        const apiPath = path.join(process.cwd(), pathToFolder);

        const files = fs.readdirSync(apiPath);

        for (const fileName of files) {
            if (!fileName.endsWith(dotJs) || fileName.startsWith(index)) continue;
            const filePath = path.join(apiPath, fileName);
            const serviceName = path.basename(fileName, dotJs);
            aggr[serviceName] = require(filePath);
        }

        return aggr;
    },

    dependencyInjectionMap,

    parseCookies: (cookies) => {
        if (cookies) {
            const list = {};
            cookies.split(';').forEach((cookie) => {
                const parts = cookie.split('=');
                list[parts.shift().trim()] = decodeURI(parts.join('='));
            });
            return list;
        }
    },

    stringifyCookies: cookies => Object
        .entries(cookies)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`),

    validateEmail: email => emailRegexp.test(email),
};
