
exports.up = function(knex, Promise) {
    return knex("users").del();
};

exports.down = function(knex, Promise) {
  
};
