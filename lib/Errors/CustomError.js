'use strict';

class CustomError extends Error {
    constructor(data = {}, ...args) {
        super(...args);
        this.code = 'CUSTOM_ERROR';
        this.error = data.error;
        this.key = data.key;
        this.name = 'CustomError';
        this.params = data.params;
        this.statusCode = data.statusCode;
    }

    formatResponseBody() {
        const message = `New custom error. 
        Key: ${this.key}
        Params: ${this.params}
        Status Code: ${this.statusCode}`;
        console.log(message);
        return { key: this.key, params: this.params };
    }

    toJSON() {
        const plainObject = {};
        ['code', 'statusCode', 'error', 'key', 'params', ...Object.getOwnPropertyNames(this)].forEach((key) => {
            plainObject[key] = this[key];
        });
        return plainObject;
    }
}

module.exports = CustomError;
