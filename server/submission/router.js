const express = require("express");
const {
  getSubmissionController,
  postSubmissionController,
} = require("./controller/index");
const submissionRouter = express.Router();
submissionRouter.get("/submissions/:problemId", getSubmissionController);
submissionRouter.post("/submission", postSubmissionController);
module.exports = { submissionRouter: submissionRouter };
