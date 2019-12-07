const knex = require('../../../instances/knex');

module.exports = async (ctx) => {
    const emailRequests = await knex("emailRequests").select("*");

    ctx.body = {
        data: emailRequests,
    };
};
