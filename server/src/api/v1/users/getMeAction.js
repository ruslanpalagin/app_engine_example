const usersRepository = require("../../../repositories/usersRepository");

module.exports = async (ctx) => {
    const { token } = ctx.request.headers;
    const user = await usersRepository.findBy({ apiToken: token });

    ctx.body = {
        data: user,
    };
};
