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
  getAllProblemController: function (req, res, next) {
    const filteredProblems = PROBLEMS.map((x) => ({
      problemId: x.problemId,
      difficulty: x.difficulty,
      acceptance: x.acceptance,
      title: x.title,
    }));

    res.json({
      problems: filteredProblems,
    });
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getProblem: function (req, res, next) {
    const id = req.params.id;

    const problem = PROBLEMS.find((x) => x.problemId === id);

    if (!problem) {
      return res.status(411).json({});
    }

    res.json({
      problem,
    });
  },
};
