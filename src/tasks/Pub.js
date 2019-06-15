const {PubSub} = require('@google-cloud/pubsub');

class Pub {
  static async execute() {
    const pubsub = new PubSub();

    const data = JSON.stringify({ foo: 'bar', t: (new Date()).getTime() });

    const dataBuffer = Buffer.from(data);

    const messageId = await pubsub.topic("default").publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
    process.exit(0);
  }
}

module.exports = Pub;
