const amqplib = require('amqplib');
const { v4: uuidv4 } = require('uuid');

async function sendMessage(data) {
  const connection = await amqplib.connect({
    hostname: process.env.RABBIT_MQ_HOST,
    username: process.env.RABBIT_MQ_USER,
    password: process.env.RABBIT_MQ_PASSWORD
  });
  const channel = await connection.createConfirmChannel();

  const queue = await channel.assertQueue('', {
    exclusive: true
  });
  const correlationId = uuidv4();

  await channel.sendToQueue('exchange-rates',
    Buffer.from(data),
    {
      correlationId: correlationId,
      replyTo: queue.queue
    }
  );

  return new Promise((resolve, reject) => {
    channel.consume(queue.queue, function (message) {
      if (message.properties.correlationId === correlationId) {
        resolve(JSON.parse(message.content.toString()));
      } else {
        reject(new Error('Correlation id is incorrect'));
      }
    }, {
      noAck: true
    });
  });
}

module.exports = {
  sendMessage
};
