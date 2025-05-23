"use strict";

const { resolve } = require('path');
const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
// const redisClient = redis.createClient()

const { getRedis } = require('../dbs/init.redis')
const redisClient = getRedis()

const pExpire = redisClient.pExpire
const setNXAsync = redisClient.setNX

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds tam lock

    for (let i = 0; i < retryTimes; i++) {
        // tao 1 key, thang nao nam giu duoc vao thanh toan
        const result = await setNXAsync(key, expireTime);
        if (result === 1) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId,
            });
            if (isReservation.modifiedCount) {
                await pExpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
    return false;
};

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock,
};
