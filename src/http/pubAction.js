const Pub = require("../useCases/Pub");

module.exports = async (ctx) => {
    const messageId = await Pub.execute();
    ctx.body = `Message ${messageId} published.`;
};
