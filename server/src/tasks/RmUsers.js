const knex = require("../instances/knex");

class RmUsers {
  static async execute() {
    const count = await knex('users').del();
    console.log(count);
    process.exit(0);
  }
}

module.exports = RmUsers;
