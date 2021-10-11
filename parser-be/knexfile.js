require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_MASTER_HOST,
      port: process.env.DB_MASTER_PORT,
      user: process.env.DB_MASTER_USER,
      password: process.env.DB_MASTER_PASSWORD,
      database: process.env.DB_MASTER_NAME
    },
    migrations: {
      tableName: 'migrations',
      directory: './migrations'
    }
  }
};
