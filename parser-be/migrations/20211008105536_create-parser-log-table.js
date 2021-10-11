exports.up = function (knex) {
  return knex.schema
    .createTable('parser_log', function (table) {
      table.increments('id');
      table.integer('user_id').notNullable();
      table.datetime('date').nullable();
      table.string('origin', 100).nullable();
      table.specificType('exchange_rates', 'JSONB[]').nullable();
      table.timestamps();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('parser_log');
};
