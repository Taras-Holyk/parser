const dbMaster = require('../config/db-master');
const dbSlave = require('../config/db-slave');

function getRecentByUserAndDate(userId, date) {
  const startDate = new Date();
  let endDate = new Date(startDate);
  startDate.setMinutes(startDate.getMinutes() - 15);

  return dbSlave('parser_log')
    .where({
      user_id: userId,
      date: date,
      origin: 'minfin'
    })
    .andWhereBetween('created_at', [startDate, endDate])
    .orderBy('created_at', 'desc')
    .first();
}

function getLastByUser(userId) {
  return dbSlave('parser_log')
    .where({
      user_id: userId,
      origin: 'minfin'
    })
    .orderBy('created_at', 'desc')
    .first();
}

function store(params) {
  return dbMaster('parser_log').insert(params);
}

module.exports = {
  getRecentByUserAndDate,
  store,
  getLastByUser
};
