const development = {
    debug: true,
    client: 'pg',
    connection: {
        host : 'localhost',
        port: '5433',
        user : 'postgres',
        password : '8pM6oDOgbkyxuMH9',
        database : 'dockerdemo_development'
    },
    pool: { min: 1, max: 7 },
    migrations: {
        tableName: 'knex_migrations'
    }
};

const production = {
    debug: true,
    client: 'pg',
    connection: {
        host : '/cloudsql/docker-test-241719:europe-west6:instance1',
        user : 'postgres',
        password : '8pM6oDOgbkyxuMH9',
        database : 'dockerdemo_production'
    },
    pool: { min: 1, max: 7 },
    migrations: {
        tableName: 'knex_migrations'
    }
};

const all = {
    development,
    production,
};
all.currentEnv = all[process.env.NODE_ENV || "development"];

module.exports = all;

// instance1 8pM6oDOgbkyxuMH9 https://cloud.google.com/sql/docs/postgres/connect-app-engine?hl=ru
//  gcloud sql connect instance1 --user=postgres
