"use strict";
const amqp = require("amqplib");

async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:guest@localhost");

  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";
  await channel.assertQueue(queueName, {
    durable: true, // khi server bi van de va crash rabbitmq, va restart lai rabbitmq thi cac du lieu se duoc luu lai va tiep tuc gui khi restart
  });

  // set prefetch
  channel.prefetch(1); // Moi task vu se xu ly tuan tu, khong dong thoi

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log(`message: ${message}`);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch(console.error);
