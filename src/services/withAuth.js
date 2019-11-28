const auth = require("./auth");

const withAuth = () => {
    return async (ctx, next) => {
        const isValid = await auth.isValidApiToken(ctx.request.headers.token);
        if (isValid) {
            await next();
        } else {
            ctx.response.status = 401;
        }
    };
};

module.exports = withAuth;
