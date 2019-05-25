const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World with yarn! Powered by GCP';
});

app.listen(8080);
 
// instance1 8pM6oDOgbkyxuMH9 https://cloud.google.com/sql/docs/postgres/connect-app-engine?hl=ru
//  gcloud sql connect instance1 --user=postgres