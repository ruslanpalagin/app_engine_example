const development = {
    debug: true,
    client: 'pg',
    connection: {
      host : '34.65.174.239',
      user : 'postgres',
      password : '8pM6oDOgbkyxuMH9',
      database : 'ecommerce_staging'
    },
    pool: { min: 1, max: 7 },
    migrations: {
      tableName: 'knex_migrations'
    }
  };

const staging = {
    debug: true,
    client: 'pg',
    connection: {
      host : '/cloudsql/docker-test-241719:europe-west6:instance1',
      user : 'postgres',
      password : '8pM6oDOgbkyxuMH9',
      database : 'ecommerce_staging'
    },
    pool: { min: 1, max: 7 },
    migrations: {
      tableName: 'knex_migrations'
    }
  };

const all = {
    development,
    staging,
};
all.currentEnv = all[process.env.ENV || "development"];

module.exports = all;

// instance1 8pM6oDOgbkyxuMH9 https://cloud.google.com/sql/docs/postgres/connect-app-engine?hl=ru
//  gcloud sql connect instance1 --user=postgres
