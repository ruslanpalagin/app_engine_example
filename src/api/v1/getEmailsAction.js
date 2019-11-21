const list = require('../../services/list');

module.exports = async (ctx) => {
    ctx.body = {
        data: list.q,
    };
};
