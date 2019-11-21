const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const koaBody = require('koa-body');

const homeAction = require("./http/home");
const pubAction = require("./http/pubAction");
const apiV1BetaListAction = require("./api/v1/betaListAction");

router.get("/", homeAction);
router.get("/pub", pubAction);
router.post("/api/v1/beta-list", koaBody(), apiV1BetaListAction);

app.use(router.routes());
app.listen(8080);
