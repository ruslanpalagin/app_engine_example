const SubUseCase = require("../useCases/Sub");

class Pub {
  static async execute() {
    await SubUseCase.execute();

    // const timeout = 60;
    // setTimeout(() => {
    //   process.exit(0);
    // }, timeout * 1000);
  }
}

module.exports = Pub;
