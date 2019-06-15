const {PubSub} = require('@google-cloud/pubsub');

class Pub {
    static async execute() {
        const pubsub = new PubSub();
        const data = JSON.stringify({ source: 'http', t: (new Date()).getTime() });
        const dataBuffer = Buffer.from(data);
        return await pubsub.topic("default").publish(dataBuffer);
    }
}

module.exports = async (ctx) => {
    const messageId = await Pub.execute();
    ctx.body = `Message ${messageId} published.`;
};
