const config = require('dotenv').config();
if (config.error) {
  throw config.error;
}

const rabbitmq = require('./helpers/rabbitmq');

(async function process() {
  await rabbitmq.getExchangeRates();
}());
