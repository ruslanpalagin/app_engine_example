const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const withAuth = require('./services/withAuth');

app.use(cors());

const homeAction = require("./http/home");
const pubAction = require("./http/pubAction");
const createEmailsAction = require("./api/v1/createEmailsAction");
const getEmailsAction = require("./api/v1/getEmailsAction");
const processEmailAction = require("./api/v1/processEmailAction");
const createTokenAction = require("./api/v1/tokens/createTokenAction");
const getMeAction = require("./api/v1/users/getMeAction");

router.get("/", homeAction);
router.get("/pub", pubAction);
router.post("/api/v1/emails", koaBody(), createEmailsAction);
router.get("/api/v1/emails", koaBody(), withAuth(), getEmailsAction);
router.post("/api/v1/emails/:id/process", koaBody(), processEmailAction);
router.post("/api/v1/tokens", koaBody(), createTokenAction);
router.get("/api/v1/users/me", getMeAction);

app.use(router.routes());
app.listen(8080);
