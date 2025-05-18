'use strict'

const { ForbiddenError } = require("../core/error.response");
const { findById } = require("../services/apikey.service");
const { HEADER } = require("../utils");

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            throw new ForbiddenError();
            // return res.status(403).json({ message: 'Forbidden Error' })
        }

        // check objKey
        const objKey = await findById(key);
        if (!objKey) {
            throw new ForbiddenError();
            // return res.status(403).json({ message: 'Forbidden Error' })
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.log('error::', error);

    }
}

const permission = (permission) => {
    // trình bao đóng, trả về 1 hàm mà hàm đó có thể sử dụng các biến của thằng cha
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({ message: 'Permission denied' })
        }

        console.log('permissions::', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({ message: 'Permission denied' })
        }

        return next();
    }
}

module.exports = {
    apiKey,
    permission
}