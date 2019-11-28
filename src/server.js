const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const withAuth = require('./services/withAuth');

app.use(cors());

const homeAction = require("./http/home");
const pubAction = require("./http/pubAction");

const getEmailsAction = require("./api/v1/emails/getEmailsAction");
const createTokenAction = require("./api/v1/tokens/createTokenAction");
const getMeAction = require("./api/v1/users/getMeAction");
const createCampaignAction = require("./api/v1/campaigns/createCampaignAction");

router.get("/", homeAction);
router.get("/pub", pubAction);

router.post("/api/v1/tokens", koaBody(), createTokenAction);
router.get("/api/v1/emails", withAuth(), getEmailsAction);
router.get("/api/v1/users/me", withAuth(), getMeAction);
router.post("/api/v1/campaigns", withAuth(), koaBody(), createCampaignAction);

app.use(router.routes());
app.listen(8080);
