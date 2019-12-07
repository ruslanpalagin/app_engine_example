const knex = require("../instances/knex");
const { exec } = require("../utils/utils");

module.exports = async (ctx) => {
    await knex('users').insert({email: Math.random()});
    await new Promise(r => setTimeout(r, 100));
    const ids = await knex.count('id as CNT').from('users');
    const { stdout: dir } = await exec("pwd");
    ctx.body = `IDS v6: ${JSON.stringify(ids)}. dir: ${dir}`;
};
