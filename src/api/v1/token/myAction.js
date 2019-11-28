const auth = require('../../../services/auth');

module.exports = async (ctx) => {
    console.log("ctx.request.headers.token", ctx.request.headers.token);
    const tokenInfo = await auth.getTokenInfo(ctx.request.headers.token);

    ctx.body = {
        data: tokenInfo,
    };
};
