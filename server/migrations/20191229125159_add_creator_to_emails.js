
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('campaigns', function (table) {
            table.increments();
            table.string('creatorUserId');
            table.timestamps();
        }),
        knex.schema.alterTable('emailRequests', function(t) {
            t.integer("creatorUserId");
            t.integer("campaignId");
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('campaigns'),
        knex.schema.alterTable('emailRequests', function(t) {
            t.dropColumn("creatorUserId");
            t.dropColumn("campaignId");
        })
    ]);
};
