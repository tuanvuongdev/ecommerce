'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            // publicKey được gen ra bằng thuật toán đối xứng nên đang ở dạng buffer nên phải toString
            // const publicKeyString = publicKey.toString();

            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey
            })

            return tokens ? tokens : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService