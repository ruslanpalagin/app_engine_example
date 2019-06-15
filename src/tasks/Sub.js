const {PubSub} = require('@google-cloud/pubsub');

class Pub {
  static async execute() {
    const pubsub = new PubSub();

    const timeout = 60;
    const subscription = pubsub.subscription("nodekiq");

    let messageCount = 0;
    const messageHandler = message => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

      message.ack();
    };

    subscription.on(`message`, messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
      process.exit(0);
    }, timeout * 1000);
  }
}

module.exports = Pub;
