const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const { exec } = require("child_process");
const { stdout, stderr } = require("process");
const fsPromise = fs.promises;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let clients = new Set();

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("watch", (submissionId, problemId, callback) => {
    console.log("Watch Recieved");
    console.log(`SubmissionId: ${submissionId}  ProblemId: ${problemId}`);
    setTimeout(
      async (argument) => {
        console.log(`Timeout triggered SubmissionId: ${argument[0]}`);
        const data = await collectSubmissionResult(argument[0]);
        argument[1](JSON.stringify(data));
      },
      getTimeout(problemId) + 5,
      [submissionId, callback]
    );
  });
});

function getTimeout(problemId) {
  return 2000;
}
async function collectSubmissionResult(submissionId) {
  const submissionDir = `${__dirname}/sandbox/temp/${submissionId}`;
  const testResultFile = `${submissionDir}/testResult.txt`;
  const executionLogsFile = `${submissionDir}/executionLogs.${submissionId}`;
  const containerIdFile = `${submissionDir}/${submissionId}.container_id`;
  console.log(submissionDir);
  console.log(testResultFile);
  console.log(executionLogsFile);
  console.log(containerIdFile);
  let responseObject = {};
  try {
    if (fs.existsSync(testResultFile)) {
      console.log("TestResultFileExist");
      const testResultFileHandler = await fsPromise.open(testResultFile, "r");
      console.log("TestFileHandler");
      const testResultRaw = await fsPromise.readFile(
        testResultFileHandler,
        "utf-8"
      );
      testResultFileHandler.close();
      const testResultArray = testResultRaw.trim().split("\n");
      let submissionStatus = true;
      const testResultObject = testResultArray.reduce((acc, item) => {
        const [key, value] = item.split(":");
        if (key === "TEST_CASE") {
          acc.push({ [key]: value });
        } else {
          const lastIndex = acc.length - 1;
          if (key === "STATUS" && value == "false") {
            submissionStatus = false;
          }
          acc[lastIndex][key] = value;
        }
        return acc;
      }, []);
      responseObject["accepted"] = submissionStatus;
      responseObject["testCaseResult"] = testResultObject;
      console.log(testResultObject);
    } else if (fs.existsSync(containerIdFile)) {
      const containerIdFileHandler = await fsPromise.open(testResultFile, "r");
      console.log("TestFileHandler");
      const containerIdRaw = await fsPromise.readFile(
        containerIdFileHandler,
        "utf-8"
      );
      const containerId = containerIdRaw.trim();
      const killContainerCmd = `docker kill ${containerId} &> /dev/null`;
      const removeContainerCmd = `docker rm ${containerId} &> /dev/null`;
      exec(killContainerCmd, (error, stdout, stderr) => {
        if (error) console.log(stderr.toString());
        console.log(stdout.toString());
        exec(removeContainerCmd);
      });
      console.log("Internal Error");
      return "Internal Error";
    }
    if (fs.existsSync(executionLogsFile)) {
      const executionLogsFileHandler = await fsPromise.open(
        executionLogsFile,
        "r"
      );
      const executionLogsRaw = await fsPromise.readFile(
        executionLogsFileHandler,
        "utf-8"
      );
      executionLogsFileHandler.close();
      const executionLogsArray = executionLogsRaw.trim().split("\n");
      let keyValue = true;
      const executionLogsObject = executionLogsArray.reduce((acc, item) => {
        if (keyValue) {
          const [key, value] = item.split(":");
          if (key === "OUTPUT") {
            keyValue = false;
            acc[key] = [value];
          } else {
            acc[key] = value;
          }
        } else {
          acc["OUTPUT"].push(item);
        }
        return acc;
      }, {});
      console.log(executionLogsObject);
      responseObject["exited"] = executionLogsObject["EXITED"];
      responseObject["execution_output"] = executionLogsObject["OUTPUT"];
    }
  } catch (e) {
    console.error(e);
  }
  console.log(responseObject);
  return responseObject;
}
httpServer.listen(3005);
