const knex = require("../instances/knex");

(async () => {
    await knex('users').insert({email: Math.random()});
    const ids = await knex.select('*').from('users');
    console.log(ids.length);
    process.exit(0);
})();
