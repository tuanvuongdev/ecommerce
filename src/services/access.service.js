'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const keytokenModel = require('../models/keytoken.model');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /**
     *  check this token used?
     */
    static handlerRefreshToken = async (refreshToken) => {
        // check xem token đã được xử dụng chưa
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        // neu co
        if (foundToken) {
            //decode xem la ai
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log({ userId, email });
            // xoa tat ca token trong keyStore
            await KeyTokenService.removeKeyById(foundToken._id);
            throw new ForbiddenError('Something wrong happened !! Pls relogin');
        }

        // No
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) throw new AuthFailureError('Shop not registered');

        // verifyToken
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        // check userId
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop not registered');

        // create 1 cap moi
        const tokens = await createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        )

        // update token
        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken // da duoc su dung de lay token moi
            }
        })

        return {
            user: { userId, email },
            tokens
        }

    }

    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({ delKey });
        return delKey;
    }

    /**
     * 1 - check email in dbs
     * 2 - match password
     * 3 - create AT vs RT and save
     * 4 - generate tokens
     * 5 - get data return login
     */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1.
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Error: Shop not found');
        }

        // 2.
        const isMatch = await bcrypt.compare(password, foundShop.password);
        if (!isMatch) {
            throw new AuthFailureError('Authentication failure');
        }

        // 3.
        // create privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // 4. generate tokens
        const { _id: userId } = foundShop;
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        )

        await KeyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // step1: check email exist?
        const holderShop = await shopModel.findOne({ email }).lean(); //return object javascript thuần tuý khi sử dụng lean
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        });

        if (newShop) {
            // created privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1', // Public key CryptoGraphy Standards 1
            //         format: 'pem' // PEM is a common format for public key encoding
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1', // Public key CryptoGraphy Standards 1
            //         format: 'pem' // PEM is a common format for public key encoding
            //     }
            // })

            // const publicKeyString = await KeyTokenService.createKeyToken({
            //     userId: newShop._id,
            //     publicKey
            // })
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            console.log({ privateKey, publicKey }); //save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                throw new BadRequestError('Error: keyStore');
            }

            console.log('publicKeyString::', keyStore);
            // const publicKeyObject = crypto.createPublicKey(publicKeyString);
            // console.log('publicKeyObject::', publicKeyObject);

            // created token pair
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            )
            console.log('Created Token Success::', tokens);

            return {
                shop: getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: newShop
                }),
                tokens
            }

            //const tokens = await 

        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService;