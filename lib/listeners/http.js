const http = require('http');
const {
    receiveArgs,
    middlewareRunner,
    parseCookies,
    stringifyCookies,
} = require('../helpers');
const CustomError = require('../Errors/CustomError');
const logger = require('../helpers/logger')('main');
const { messages } = global;

const CORS_HEADERS = {
    'Access-Control-Allow-Methods': 'POST, GET, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': 86400, // 30 days
    'Access-Control-Expose-Headers': 'x-access-token',
    'Access-Control-Allow-Headers': 'X-Requested-With, x-access-token, X-HTTP-Method-Override, Content-Type, Accept',
};

const setHeadersProcedure = (res, origin) => {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'x-access-token');
    res.setHeader('Access-Control-Allow-Headers', 'x-access-token, X-access-token, X-Requested-With, Origin,'
                + 'Accept, Content-Type,Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers');
};

module.exports = (routing, PORT = 4000) => {
    http.createServer(async (req, res) => {
        const { url, headers, method } = req;

        if (method === global.httpMethods.OPTIONS) {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': `${headers.origin}`,
                ...CORS_HEADERS,
            });
            return res.end();
        }

        setHeadersProcedure(res, headers.origin);

        try {
            const cookies = parseCookies(headers.cookie);
            const relativeUrlArray = url.split('?')[0].substring(1).split('/');
            const entity = relativeUrlArray.reduce((aggr, key) => {
                if (!aggr.has(key)) {
                    throw new CustomError({
                        key: messages.notFound,
                        params: { route: relativeUrlArray.join('/') },
                        statusCode: 404,
                    });
                }
                return aggr.get(key);
            }, routing);
            if (!entity.has(method)) {
                throw new CustomError({
                    key: messages.notFound,
                    params: { route: relativeUrlArray.join('/') },
                    statusCode: 404,
                });
            }
            const { validator, middleware, handler } = entity.get(method);
            if (!handler) {
                throw new CustomError({
                    key: messages.notFound,
                    params: { route: relativeUrlArray.join('/') },
                    statusCode: 404,
                });
            }
            const args = await receiveArgs(req);
            let middlewareData = {};
            if (middleware && middleware.length) {
                middlewareData = await middlewareRunner(args, middleware, headers, cookies);
            }
            if (validator) {
                await validator({ ...args, ...middlewareData });
            }
            logger.log(`${method} ${url}`);
            const result = await handler({ ...args, ...middlewareData });
            res.setHeader('Content-Type', 'application/json');
            if (cookies && Object.values(cookies).length) {
                res.setHeader('Set-Cookie', stringifyCookies({ ...cookies }));
            }
            if (result && result.token && result.token.length) {
                res.setHeader('x-access-token', result.token);
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, ...result }));
        } catch (error) {
            logger.error(error);
            const response = { success: false };

            if (error instanceof CustomError) {
                const message = error.formatResponseBody();
                res.writeHead(error.statusCode);
                res.end(JSON.stringify({ ...response, message }));
                return;
            }
            res.writeHead(500);
            res.end(JSON.stringify({ success: false, message: { key: messages.internalError } }));
        }
    }).listen(PORT);
    logger.access(`🚀 HTTP server started on port ${PORT}`);
};
