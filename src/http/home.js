const knex = require("../instances/knex");
const { exec } = require("../utils/utils");

module.exports = async (ctx) => {
    await knex('users').insert({email: Math.random()});
    const ids = await knex.select('*').from('users');
    const { stdout: dir } = await exec("pwd");
    ctx.body = `IDS v4: ${ids.length}. dir: ${dir}`;
};
