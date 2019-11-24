const auth = require('../../../services/auth');

module.exports = async (ctx) => {
    console.log(ctx.request.body);

    const apiToken = await auth.getApiToken(ctx.request.body.data);

    ctx.body = {
        data: {
            apiToken,
        },
    };
};