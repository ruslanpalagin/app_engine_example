const Koa = require('koa');
const app = new Koa();

const homeAction = require("./http/home");

app.use(homeAction);

app.listen(8080);
 