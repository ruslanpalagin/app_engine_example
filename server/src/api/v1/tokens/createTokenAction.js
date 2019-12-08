const auth = require('../../../services/auth');
const knex = require("../../../instances/knex");
const usersRepository = require("../../../repositories/usersRepository");

module.exports = async (ctx) => {
    const googleResponse = ctx.request.body.data;
    const { googleId, accessToken, profileObj } = googleResponse;
    let user = await usersRepository.findBy({ googleId });
    const apiToken = await auth.createApiToken(accessToken);
    console.log("user", user);
    console.log("apiToken", apiToken);

    if (!user) {
        user = { googleId, apiToken, email: profileObj.email, name: profileObj.name };
        await knex('users').insert(user);
    } else {
        await knex('users')
        .where({ id: user.id })
        .update({
            apiToken,
            googleId,
        });
    }

    ctx.body = {
        data: {
            apiToken,
        },
    };
};
