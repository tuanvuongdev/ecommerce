'use strict'

const redis = require('redis');
const { RedisError } = require('../core/error.response');

// // create a new client redis
// const client = redis.createClient({
//     host: '127.0.0.1',
//     port: 6379,
// });

// client.on('error', (err) => {
//     console.log(`Redis error: ${err}`);
// });

// module.exports = client

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}, connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Redis loi roi anh em oi',
        en: 'Service redis connect error'
    }
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {

        throw new RedisError({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })

    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({
    connectionRedis
}) => {
    // check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionRedis - Connection status: connected`);
        clearTimeout(connectionTimeout)
    }).on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`);
        // connect retry
        !connectionTimeout && handleTimeoutError()
    }).on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnecting`);
        clearTimeout(connectionTimeout)
    }).on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: ${err}`);
        // connect retry
        !connectionTimeout && handleTimeoutError()
    })

    return connectionRedis
}

const initRedis = async () => {

    const instanceRedis = await redis.createClient();
    await handleEventConnection({ connectionRedis: instanceRedis }).connect()

    return instanceRedis
}

const getRedis = () => initRedis()

const closeRedis = () => {
    if (client.instanceConnect) {
        client.instanceConnect.quit((err) => {
            if (err) {
                console.log('Error closing Redis connection:', err);
            } else {
                console.log('Redis connection closed');
                client.instanceConnect = null;
            }
        });
    }
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}