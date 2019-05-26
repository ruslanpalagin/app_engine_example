const knex = require("../instances/knex");

module.exports = async (ctx) => {
    await knex('test').insert({id: 100});
    const ids = await knex.select('*').from('test');
    ctx.body = `IDS: ${JSON.stringify(ids)}`;
};
