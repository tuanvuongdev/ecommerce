const amqp = require('amqplib')
const message = 'hello, RabbitMQ for Vuongpt'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123123@localhost')

        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true // khi server bi van de va crash rabbitmq, va restart lai rabbitmq thi cac du lieu se duoc luu lai va tiep tuc gui khi restart
        })

        // send messages to consumer channel
        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`message sent: ${message}`);
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(console.error)