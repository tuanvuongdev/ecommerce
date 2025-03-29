'use strict'

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id'
}

/**
 *  publicKey: verify token
 *  privateKey: sign token
*/
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })

        // JWT.verify(accessToken, publicKey, (err, decoded) => {
        //     if (err) {
        //         console.error('error verify::', err);
        //     } else {
        //         console.log('decoded::', decoded);
        //     }
        // })
        return { accessToken, refreshToken }
    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - Check userId missing?
        2 - get accessToken 
        3 - Verify token
        4 - check user in dbs
        5 - check keystore with this userId?
        6 - ok all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError('Invalid Request');
    }

    // 2.
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }

    // 3.
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new AuthFailureError('Invalid Request');
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid Request');
        }

        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /*
        1 - Check userId missing?
        2 - get accessToken 
        3 - Verify token
        4 - check user in dbs
        5 - check keystore with this userId?
        6 - ok all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError('Invalid Request');
    }

    // 2.
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }

    // 3.
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) {
                throw new AuthFailureError('Invalid Request');
            }

            req.user = decodeUser;
            req.keyStore = keyStore;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];

    if (!accessToken) {
        throw new AuthFailureError('Invalid Request');
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid Request');
        }

        req.user = decodeUser;
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}