const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const withAuth = require('./services/withAuth');
const emailRequestProcessor = require('./services/emailRequestProcessor');

app.use(cors());

router.get("/", require("./http/home"));
router.get("/pub", require("./http/pubAction"));

router.post("/api/v1/tokens", koaBody(), require("./api/v1/tokens/createTokenAction"));
router.get("/api/v1/emails", withAuth(), require("./api/v1/emails/getEmailsAction"));
router.patch("/api/v1/emails/:id", withAuth(), koaBody(), require("./api/v1/emails/patchEmailAction"));
router.post("/api/v1/emails/:id/submissions", withAuth(), koaBody(), require("./api/v1/tokens/createTokenAction"));
router.get("/api/v1/users/me", withAuth(), require("./api/v1/users/getMeAction"));
router.post("/api/v1/campaigns", withAuth(), koaBody(), require("./api/v1/campaigns/createCampaignAction"));
router.post("/api/v1/silent-submissions", withAuth(), koaBody(), require("./api/v1/silentSubmissions/createSilentSubmissionAction"));

app.use(router.routes());
app.listen(8080);

emailRequestProcessor.on();
