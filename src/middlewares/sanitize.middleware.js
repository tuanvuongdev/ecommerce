'use strict';

const sanitize = require("mongo-sanitize");


const sanitizeMiddleware = (req, res, next) => {
    // Sanitize query parameters
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = sanitize(req.query[key]);
        });
    }

    // Sanitize body parameters
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            req.body[key] = sanitize(req.body[key]);
        });
    }

    // Sanitize params
    if (req.params) {
        Object.keys(req.params).forEach(key => {
            req.params[key] = sanitize(req.params[key]);
        });
    }

    next();
};

module.exports = sanitizeMiddleware; 