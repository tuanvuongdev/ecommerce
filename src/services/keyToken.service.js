'use strict'

const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // publicKey được gen ra bằng thuật toán đối xứng nên đang ở dạng buffer nên phải toString
            // const publicKeyString = publicKey.toString();

            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens : null

            // level xxx
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true };
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: userId });
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id })
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken }).lean()
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.findByIdAndDelete({ user: userId })
    }
}

module.exports = KeyTokenService