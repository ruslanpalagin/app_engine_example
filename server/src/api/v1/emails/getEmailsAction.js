const knex = require('../../../instances/knex');

module.exports = async (ctx) => {
    const emailRequests = await knex("emailRequests").select("*")
        .where({ creatorUserId: ctx.currentUser.id })
        .whereNot("status", "deleted")
        .orderBy('id', 'desc');

    ctx.body = {
        data: emailRequests,
    };
};
