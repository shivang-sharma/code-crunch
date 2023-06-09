const illegalStrings = [
  "java.io.*",
  "java.io.File;",
  "java.io.FileWriter;",
  "java.io.FileDescriptor;",
  "java.io.FileFilter;",
  "java.io.FileInputStream;",
  "java.io.FileOutputStream;",
  "java.io.FilePermission;",
  "java.io.FileReader;",
  "java.io.FilenameFilter;",
  "java.net",
  "java.nio",
  "java.net",
  "ProcessBuilder",
  "Process",
  "Runtime.getRuntime()",
  "Runtime",
  "java.lang.reflect",
  "java.util.zip",
  "java.security",
  "java.sql",
  "java.util.logging",
  "javax.crypto",
  "java.rmi",
  "javax.script",
  "java.util.concurrent",
  "java.beans",
  "javax.servlet",
  "Thread",
  "Runnable",
];
const requiredStrings = ["package sourceCode;", "public class Submission"];
module.exports = {
  analyze: (submission) => {
    let report = {
      status: "true",
      error: "",
    };
    for (let illegalString of illegalStrings) {
      let illegalOccurance = String(submission).match(illegalString);
      if (illegalOccurance) {
        report.status = false;
        report.error = `ILLEGAL: ${illegalOccurance}`;
        return report;
      }
    }
    for (let requiredString of requiredStrings) {
      let requiredOccurence = String(submission).match(requiredString);
      if (requiredOccurence === null) {
        report.status = false;
        report.error = `MISSING: ${requiredString}`;
        return report;
      }
    }
  },
};
