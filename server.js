const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World with yarn! Powered by GCP';
});

app.listen(8080);