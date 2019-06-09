web: ENV=production node src/server.js
migrations: ENV=production ./node_modules/knex/bin/cli.js migrate:latest
dbTest: ENV=production node src/bin/dbTest.js
logEnv: ENV=production node src/bin/logEnv.js