const amqp = require("amqplib");
const { exec } = require("child_process");
const fs = require("fs");
const fsPromise = fs.promises;

/**
 * class Consumer
 * Description: Consumer to consume jobs from the rabbit  queue
 */
class Consumer {
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
  consume(executeJob) {
    if (!(this.#connection && this.#channel)) {
      throw err;
    } else {
      this.#channel.consume(
        this.#queueName,
        (message) => {
          const job = JSON.parse(message.content.toString());
          console.log(`--------Job Recieved--------`);
          console.log(`SubmissionId: ${job.submissionId}`);
          console.log(`SubmissionId: ${job.languageId}`);
          console.log(`SubmissionId: ${job.problemId}`);
          console.log(`SubmissionId: ${job.submission}`);
          executeJob(job);
          // channel.ack(message) To send the acknowledgement to all the message explicitly
        },
        { noAck: true } // true so that implicitly acknowledgement is sent to every message
      );
    }
  }
  shutdown() {
    try {
      this.#channel.close();
      this.#connection.close();
    } catch (e) {
      console.log(`Error occured while shutting down publisher : ${e}`);
    }
  }
}

/**
 *
 * @param {*} job
 */
async function jobHandler(job) {
  const submissionId = job.submissionId;
  const languageId = job.languageId;
  const problemId = job.problemId;
  const submission = job.submission;
  const extension = retrieveExtension(languageId);
  const sandbox = retrieveSandbox(languageId);
  let directoryName = submissionId;
  let sourceCodeFile = `Submission.${extension}`;
  let testDataFile = `testData.txt`;
  let submissionDir = __dirname + "/sandbox/temp/" + directoryName;
  let sourceCodeDir = submissionDir + "/sourceCode/";
  let resultDir = submissionDir + "/result/";
  let testDataDir = __dirname + `/sandbox/temp/testData/${problemId}/`;
  await generateSubmissionFile(sourceCodeDir, sourceCodeFile, submission);
  const timeoutForProblem = await generateTestDataFile(
    problemId,
    testDataDir,
    testDataFile
  );
  console.log("Line 86 ", timeoutForProblem, typeof timeoutForProblem);
  triggerJob(
    submissionDir,
    testDataDir,
    submissionId,
    timeoutForProblem / 1000,
    sandbox,
    problemId
  );
}
/**
 *
 * @param {*} submissionDir
 * @param {*} testDataDir
 * @param {*} submissionId
 * @param {*} timeout
 * @param {*} sandbox
 */
function triggerJob(
  submissionDir,
  testDataDir,
  submissionId,
  timeout,
  sandbox,
  problemId
) {
  const cmd =
    __dirname +
    `/sandbox/trigger.sh ${submissionDir} ${testDataDir} ${submissionId} ${timeout} ${sandbox} ${problemId}| tee ${submissionDir}/executionLogs.${submissionId}`;
  exec(cmd);
}
/**
 *
 * @param {*} problemId
 * @param {*} testDataDir
 */
async function generateTestDataFile(problemId, testDataDir, testDataFile) {
  try {
    await fsPromise.mkdir(testDataDir, { recursive: true });
    console.log(`Directory created for ProblemId: ${testDataDir}`);
    if (!fs.existsSync(testDataDir + testDataFile)) {
      const testData = retrieveTestData(problemId);
      let timeout = Number.parseInt(testData.timeout);
      const fileHandler = await fsPromise.open(testDataDir + testDataFile, "w");
      let data;
      for (let test in testData.testCase) {
        data = `${test}\n${testData.testCase[test]}\n`;
        fsPromise.writeFile(fileHandler, data).then((value) => {
          console.log(
            `Test Data ${data} is written to ${testDataDir + testDataFile}`
          );
        });
      }
      await fileHandler.close();
      return timeout;
    }
    return retrieveTimeoutForProblem(problemId);
  } catch (error) {
    throw error;
  }
}
/**
 *
 * @param {*} sourceCodeDir
 * @param {*} sourceCodeFile
 * @param {*} submission
 */
async function generateSubmissionFile(
  sourceCodeDir,
  sourceCodeFile,
  submission
) {
  try {
    await fsPromise.mkdir(sourceCodeDir, { recursive: true });
    console.log(`Directory created for SubmissionId: ${sourceCodeDir}`);
    await fsPromise.writeFile(
      sourceCodeDir + sourceCodeFile,
      submission,
      "utf-8"
    );
    console.log(`Submission code written to ${sourceCodeDir + sourceCodeFile}`);
  } catch (error) {
    throw error;
  }
}

function retrieveTimeoutForProblem(problemId) {
  const timeouts = {
    P101: 100,
  };
  return timeouts[problemId];
}
/**
 *
 * @param {*} problemId
 * @returns
 */
function retrieveTestData(problemId) {
  let testData = {
    testCase: {
      1: "1\t2\n3",
      2: "2\t4\n6",
      3: "5\t2\n7",
    },
    timeout: 100,
  };
  return testData;
}
/**
 *
 * @param {*} languageId
 * @returns
 */
function retrieveExtension(languageId) {
  switch (languageId) {
    case "L101":
      return "java";
      break;
    case "L102":
      return "py";
      break;
    default:
      throw new Error("Language Not supported");
  }
}
function retrieveSandbox(languageId) {
  switch (languageId) {
    case "L101":
      return "java_sandbox";
      break;
    case "L102":
      return "python_sandbox";
      break;
    default:
      throw new Error("Language Not supported");
  }
}
(async () => {
  const consumer = new Consumer("submissionQueue");
  await consumer.connect();
  consumer.consume((job) => {
    jobHandler(job);
  });
})();
