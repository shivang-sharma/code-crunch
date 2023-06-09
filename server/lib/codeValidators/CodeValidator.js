const javaCodeAnalyzer = require("./validators/javaCodeValidator");
module.exports = {
  analyze: (submission, languageId) => {
    switch (languageId) {
      case "1":
        return javaCodeAnalyzer.analyze(submission);
        break;
    }
  },
};
