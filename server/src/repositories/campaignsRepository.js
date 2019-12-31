const knex = require("../instances/knex");

const campaignsRepository = {
    async findBy(where) {
        const users = await knex.select('*').from('campaigns').where(where).limit(1);
        return users.length ? users[0] : null;
    },
    async create(item = {}) {
        return (await this.bulkCreate([item]))[0];
    },
    async createAndGet(item = {}) {
        const id = await this.create(item);
        return await this.findBy({ id });
    },
    async bulkCreate(items) {
        return await knex("campaigns").insert(items).returning('id').into('campaigns');
    },
};

module.exports = campaignsRepository;
