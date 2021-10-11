const db = require('../config/db');

function getByEmail(email) {
  return db('users').where('email', email).first();
}

function createUser(params) {
  return db('users').insert(params);
}

module.exports = {
  getByEmail,
  createUser
};
