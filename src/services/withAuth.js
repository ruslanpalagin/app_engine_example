const auth = require("./auth");

const withAuth = () => {
    return async (ctx, next) => {
        const isValid = auth.isValidApiToken(ctx.request.headers.token);
        console.log("isValid", isValid);
        if (isValid) {
            await next();
        } else {
            new Error("Invalid Token");
        }
    };
};

module.exports = withAuth;
