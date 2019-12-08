const auth = require("./auth");

const withAuth = () => {
    return async (ctx, next) => {
        const { isValid, user } = await auth.isValidApiToken(ctx.request.headers.token);
        if (isValid) {
            ctx.currentUser = user;
            await next();
        } else {
            ctx.response.status = 401;
        }
    };
};

module.exports = withAuth;
