const amqplib = require('amqplib');

const minFinSiteParser = require('./minfin-site.parser');

async function getExchangeRates(queue = 'exchange-rates') {
  const connection = await amqplib.connect({
    hostname: process.env.RABBIT_MQ_HOST,
    username: process.env.RABBIT_MQ_USER,
    password: process.env.RABBIT_MQ_PASSWORD
  });
  const channel = await connection.createConfirmChannel();

  await channel.assertQueue(queue, {
    durable: false
  });
  channel.prefetch(1);

  await channel.consume(queue, async (message) => {
    const data = JSON.parse(message.content.toString());
    const exchangeRates = await minFinSiteParser
      .getExchangeRates({ date: data.requestedDate });

    channel.sendToQueue(
      message.properties.replyTo,
      Buffer.from(JSON.stringify(exchangeRates)), {
        correlationId: message.properties.correlationId
      }
    );

    channel.ack(message);
  });
}

module.exports = {
  getExchangeRates
};
