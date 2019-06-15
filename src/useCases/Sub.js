const {PubSub} = require('@google-cloud/pubsub');

class Pub {
  static async execute() {
    const pubsub = new PubSub();

    const subscription = pubsub.subscription("nodekiq");

    subscription.messageCount = 0;
    const messageHandler = message => {
      subscription.messageCount += 1;
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      console.log(`${subscription.messageCount} message(s) received.`);

      message.ack();
    };

    subscription.on(`message`, messageHandler);

    return subscription;

    // const timeout = 60;
    // setTimeout(() => {
    //   subscription.removeListener('message', messageHandler);
    //   console.log(`${messageCount} message(s) received.`);
    //   process.exit(0);
    // }, timeout * 1000);
  }
}

module.exports = Pub;
