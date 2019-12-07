const knex = require("../instances/knex");

const emailRequestsRepository = {
    async findBy(where) {
        const resources = await knex.select('*').from('emailRequests').where(where).limit(1);
        return resources.length ? resources[0] : null;
    },
    async update({id}, data) {
        delete data.id;
        return knex('emailRequests')
            .where({ id })
            .update(data);
    },
};

module.exports = emailRequestsRepository;
