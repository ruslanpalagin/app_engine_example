// const knex = require('knex')({
//     debug: true,
//     client: 'pg',
//     connection: {
//       host : '/cloudsql/docker-test-241719:europe-west6:instance1',
//       user : 'postgres',
//       password : '8pM6oDOgbkyxuMH9',
//       database : 'ecommerce_staging'
//     },
//   });

// module.exports = knex;

// const knex = require('knex')({
//     debug: true,
//     client: 'pg',
//     connection: {
//       host : 'localhost',
//       user : 'postgres',
//       password : 'postgres',
//       database : 'invoice_app'
//     },
//     pool: { min: 0, max: 7 }
//   });

// module.exports = knex;


const knex = require('knex')({
    debug: true,
    client: 'pg',
    connection: {
      host : '34.65.174.239',
      user : 'postgres',
      password : '8pM6oDOgbkyxuMH9',
      database : 'ecommerce_staging'
    }
  });

module.exports = knex;


// instance1 8pM6oDOgbkyxuMH9 https://cloud.google.com/sql/docs/postgres/connect-app-engine?hl=ru
//  gcloud sql connect instance1 --user=postgres