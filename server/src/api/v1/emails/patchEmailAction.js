const emailRequestsRepository = require('../../../repositories/emailRequestsRepository');

module.exports = async (ctx) => {
    const emailRequest = await emailRequestsRepository.findBy({ id: ctx.params.id });
    const data = {...emailRequest, ...ctx.request.body.data};

    await emailRequestsRepository.update(emailRequest, data);

    ctx.body = {
        data: emailRequest,
    };
};
