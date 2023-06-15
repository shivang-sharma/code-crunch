const { Request } = require("express");
const { Response } = require("express");
const { NextFunction } = require("express");
const { Logger } = require("../../lib/logger/Logger");
const { validationResult, matchedData } = require("express-validator");
const logger = new Logger("API-SERVER", "ProblemController.js")
const { getAllProblemService, getProblemService } = require("../service/ProblemService");

module.exports = {
  /**
   * Controller to handle get all problem request
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getAllProblemController: function (req, res, next) {
    (async () => {
      try {
        const problems = await getAllProblemService();
        res.status(200).json({
          problems: problems,
        });
      } catch (error) {
        logger.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    })().catch((error) => {
      logger.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    });;
  },
  /**
   * Controller to handle get problem with given problem id request
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getProblemController: function (req, res, next) {
    (async () => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        try {
          const paramData = matchedData(req);
          const problemId = paramData.id;
          const problem = await getProblemService(problemId);
          res.status(200).json(problem);
        } catch (error) {
          logger.error(error);
          if (error.msg) {
            return res.status(404).json(error.msg);
          } else {
            return res.status(500).json({ msg: "Internal Server Error" });
          }
        }
      } else {
        logger.error(result.array());
        return res.status(403).json({ error: result.array() });
      }
    })().catch((error) => {
      logger.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    });
  },
};
