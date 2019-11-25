
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('users', function(t) {
        t.string("googleId");
        t.string("apiToken");
        t.string("smtpLogin");
        t.string("smtpPassword");
        t.json("googleResponse");
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('users', function(t) {
        t.dropColumn("googleId");
        t.dropColumn("apiToken");
        t.dropColumn("smtpLogin");
        t.dropColumn("smtpPassword");
        t.dropColumn("googleResponse");
    })
};
