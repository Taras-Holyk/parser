const dbMaster = require('../config/db-master');
const dbSlave = require('../config/db-slave');

function getByEmail(email) {
  return dbSlave('users').where('email', email).first();
}

function createUser(params) {
  return dbMaster('users').insert(params);
}

module.exports = {
  getByEmail,
  createUser
};
