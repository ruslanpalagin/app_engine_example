const PubUseCase = require("../useCases/Pub");

class Pub {
  static async execute() {
    const messageId = await PubUseCase.execute();
    console.log(`Message ${messageId} published.`);
    process.exit(0);
  }
}

module.exports = Pub;
