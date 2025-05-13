const amqp = require('amqplib')
const message = 'a new product: Title abcd'

// const log = console.log

// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123123@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' // notificationEx, direct
        const notiQueue = 'notificationQueueProcess' // assertQueue
        const notificationExchangeDLX = 'notificationExDLX' // notificationEx, direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // assertQueue

        // 1. create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 2. create queue
        // Nếu Queue bị lỗi, nó sẽ được chuyển đến Exchange notificationExchangeDLX và có khoá định tuyến là notificationRoutingKeyDLX
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phep cac ket noi truy cap vao cung mot luc hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })
        console.log(`queueResult::`, queueResult)

        // 3. bind queue to exchange
        await channel.bindQueue(queueResult.queue, notificationExchange, notificationRoutingKeyDLX)

        // 4. Send message
        const msg = 'A new product'
        console.log('producer msg::', msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(console.error)