module.exports = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_SLAVE_HOST,
    port: process.env.DB_SLAVE_PORT,
    user: process.env.DB_SLAVE_USER,
    password: process.env.DB_SLAVE_PASSWORD,
    database: process.env.DB_SLAVE_NAME
  }
});
