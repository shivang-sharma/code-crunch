const { Request } = require("express");
const { Response } = require("express");
const { NextFunction } = require("express");

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getSubmissionController: function (req, res, next) {
    const problemId = req.params.problemId;
    const submissions = SUBMISSIONS.filter(
      (x) => x.problemId === problemId && x.userId === req.userId
    );
    res.json({
      submissions,
    });
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  postSubmissionController: function (req, res, next) {
    const isCorrect = Math.random() < 0.5;
    const problemId = req.body.problemId;
    const submission = req.body.submission;
    const languageId = req.body.languageId;
    const analysisReport = codeAnalyzer.analyze(submission, languageId);
    if (!analysisReport.status) {
      res.json({
        status: false,
        error: analysisReport.error,
      });
    } else {
      publisher.publish(
        JSON.stringify({
          submissionId: 1021,
          languageId: "L101",
          problemId: "P101",
          submission:
            "package sourceCode; public class Submission {public int solution(int a, int b) {return a+b;}}",
        })
      );
      if (isCorrect) {
        SUBMISSIONS.push({
          submission,
          problemId,
          userId: req.userId,
          status: "AC",
        });
        return res.json({
          status: "AC",
        });
      } else {
        SUBMISSIONS.push({
          submission,
          problemId,
          userId: req.userId,
          status: "WA",
        });
        return res.json({
          status: "WA",
        });
      }
    }
  },
};
