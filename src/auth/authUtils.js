'use strict'

const JWT = require('jsonwebtoken');

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

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error('error verify::', err);
            } else {
                console.log('decoded::', decoded);
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {

    }
}

module.exports = {
    createTokenPair
}