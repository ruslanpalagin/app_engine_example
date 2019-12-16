const emailRequestProcessor = require('../../../services/emailRequestProcessor');

module.exports = async (ctx) => {
    const emailRequest = ctx.request.body.data;
    try {
        await emailRequestProcessor.sendEmail(emailRequest, emailRequest.email);
        ctx.response.status = 201;
    } catch (e) {
        ctx.response.status = 500;
    }
};
