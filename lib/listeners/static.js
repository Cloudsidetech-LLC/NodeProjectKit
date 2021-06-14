'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const logger = require('../helpers/logger')('main');
const { messages } = global;

module.exports = (root, PORT = 4001) => {
    http.createServer(async (req, res) => {
        const url = req.url === '/' ? '/index.html' : req.url;
        const filePath = path.join(root, url);
        try {
            const data = await fs.promises.readFile(filePath);
            res.end(data);
        } catch (err) {
            res.statusCode = 404;
            res.end(messages.notFound);
        }
    }).listen(PORT);

    logger.access(`🚀 HTTP static server started on port ${PORT}`);
};
