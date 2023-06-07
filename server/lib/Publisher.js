const amqp = require("amqplib");

class Publisher {
  #queueName;
  #connection;
  #channel;
  constructor(queueName) {
    this.#queueName = queueName;
    this.#connection = null;
    this.#channel = null;
  }
  async connect() {
    if (!(this.#connection && this.#channel)) {
      this.#connection = await amqp.connect(`amqp://localhost`);
      this.#channel = await this.#connection.createChannel();
      this.#channel.assertQueue(this.#queueName, { durable: false });
      this.#connection.on("error", (err) => {
        console.log(`Error occured in Publisher Connection: ${err}`);
      });
      this.#channel.on("error", (err) => {
        console.log(`Error occured in Publisher channel: ${err}`);
      });
    }
  }
  publish(message) {
    if (!(this.#connection && this.#channel)) {
      throw err;
    } else {
      this.#channel.sendToQueue(this.#queueName, Buffer.from(message));
    }
  }
  shutdown() {
    try {
      this.#channel.close();
      this.#connection.close();
    } catch (e) {
      console.log(`Error occured while publisher shutdown : ${e}`);
    }
  }
}
const publisher = new Publisher("submissionQueue");
(async () => {
  await publisher.connect();
  console.log("Publisher connected ...");
})();
module.exports = publisher;
// (async () => {
//   const publisher = new Publisher("submissionQueue");
//   await publisher.connect();
//   publisher.publish(
//     JSON.stringify({
//       submissionId: 1021,
//       languageId: "L101",
//       problemId: "P101",
//       submission:
//         "package sourceCode; public class Submission {public int solution(int a, int b) {return a+b;}}",
//     })
//   );
//   setTimeout(() => {
//     publisher.shutdown();
//   }, 1000);
// })();
