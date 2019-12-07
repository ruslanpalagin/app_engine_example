const knex = require("../instances/knex");

class ShowUsersCount {
  static async execute() {
    const count = await knex('users').count('id');
    console.log(count);
    process.exit(0);
  }
}

module.exports = ShowUsersCount;
