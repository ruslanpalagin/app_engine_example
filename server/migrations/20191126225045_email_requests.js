const knex = require("../src/instances/knex");

exports.up = function(knex, Promise) {
    return knex.schema.createTable('emailRequests', function (table) {
        table.increments();
        table.string('email');
        table.json('props');
        table.string('status');
        table.string('subject');
        table.text('html');
        table.string('smtpLogin');
        table.string('smtpPassword');
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('emailRequests')
};
