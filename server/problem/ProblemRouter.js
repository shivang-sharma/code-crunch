const express = require("express");
const problemRouter = express.Router();

const { getAllProblemController, getProblemController } = require("./controller/ProblemController");
const { validateProblemId } = require("./util/Validator");

problemRouter.get("/problems", getAllProblemController);
problemRouter.get("/problem/:id", validateProblemId(), getProblemController);

module.exports = { problemRouter: problemRouter };
