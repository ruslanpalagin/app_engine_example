const emailRequestProcessor = require('../../../../services/emailRequestProcessor');
const emailRequestsRepository = require('../../../../repositories/emailRequestsRepository');

module.exports = async (ctx) => {
    const submissionData = ctx.request.body.data;
    const emailRequest = await emailRequestsRepository.findBy({ id: ctx.params.id });
    try {
        await emailRequestProcessor.sendEmail(emailRequest, submissionData.to);
        ctx.response.status = 201;
    } catch (e) {
        ctx.response.status = 500;
    }
};
