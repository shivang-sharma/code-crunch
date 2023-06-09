const express = require("express");
const { getAllProblemController, getProblem } = require("./controller/ProblemController");
const problemRouter = express.Router();
problemRouter.get("/problems", getAllProblemController);
problemRouter.get("/problem/:id", getProblem);
module.exports = { problemRouter: problemRouter };
