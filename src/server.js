const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();

const homeAction = require("./http/home");
const pubAction = require("./http/pubAction");

router.get("/", homeAction);
router.get("/pub", pubAction);

app.use(router.routes());
app.listen(3000);
