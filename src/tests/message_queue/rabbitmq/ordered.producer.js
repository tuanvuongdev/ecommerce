"use strict";
const amqp = require("amqplib");

async function producerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:guest@localhost");

  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";
  await channel.assertQueue(queueName, {
    durable: true, // khi server bi van de va crash rabbitmq, va restart lai rabbitmq thi cac du lieu se duoc luu lai va tiep tuc gui khi restart
  });

  for (let i = 0; i < 10; i++) {
    const message = `ordered-queued-message::${i}`;
    console.log(`message: ${message}`);

    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

producerOrderedMessage().catch(console.error);
