'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

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
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop
                    }),
                    tokens
                }
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