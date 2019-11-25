const knex = require("../instances/knex");

const usersRepository = {
    async findBy(where) {
        const users = await knex.select('*').from('users').where(where).limit(1);
        return users.length ? users[0] : null;
    }
};

module.exports = usersRepository;
