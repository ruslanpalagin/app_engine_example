const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const koaBody = require('koa-body');

const homeAction = require("./http/home");
const pubAction = require("./http/pubAction");
const createEmailsAction = require("./api/v1/createEmailsAction");
const getEmailsAction = require("./api/v1/getEmailsAction");
const processEmailAction = require("./api/v1/processEmailAction");

router.get("/", homeAction);
router.get("/pub", pubAction);
router.post("/api/v1/emails", koaBody(), createEmailsAction);
router.get("/api/v1/emails", koaBody(), getEmailsAction);
router.post("/api/v1/emails/:id/process", koaBody(), processEmailAction);

app.use(router.routes());
app.listen(8080);
