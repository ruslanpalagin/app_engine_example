
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('users', function(t) {
        t.string("email").unique('email');
      })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('users', function(t) {
        t.dropColumn('email');
      })
};
