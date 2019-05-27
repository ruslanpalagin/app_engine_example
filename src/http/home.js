const knex = require("../instances/knex");

module.exports = async (ctx) => {
    await knex('users').insert({email: Math.random()});
    const ids = await knex.select('*').from('users');
    ctx.body = `IDS: ${ids.length}`;
};
