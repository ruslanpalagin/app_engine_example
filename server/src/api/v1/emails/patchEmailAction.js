const emailRequestsRepository = require('../../../repositories/emailRequestsRepository');

module.exports = async (ctx) => {
    console.log("ctx.params.id", ctx.params.id);
    const emailRequest = await emailRequestsRepository.findBy({ id: parseInt(ctx.params.id, 10) });
    console.log("emailRequest", emailRequest);
    const data = {...emailRequest, ...ctx.request.body.data};

    await emailRequestsRepository.update(emailRequest, data);

    ctx.body = {
        data: emailRequest,
    };
};
