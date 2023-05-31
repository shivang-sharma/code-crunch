const javaCodeAnalyzer = require("./javaCodeValidator");
module.exports = {
  analyze: (submission, languageId) => {
    switch (languageId) {
      case "1":
        return javaCodeAnalyzer.analyze(submission);
        break;
    }
  },
};
