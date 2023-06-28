const express = require("express");
const problemRouter = express.Router();

const { getAllProblemController, getProblemController } = require("./controller/ProblemController");
const { validateProblemId } = require("./util/Validator");

/**
 * @swagger
 * /api/problems:
 *   get:
 *     tags:
 *       - problem
 *     summary: Problems API
 *     description: To get all problems
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 problems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       problemId:
 *                         type: integer
 *                       problemName:
 *                         type: string
 *                       problemDescription:
 *                         type: string
 *                       problemTestCase:
 *                         type: string
 *                       problemTimeout:
 *                         type: integer
 *                       problemDifficulty:
 *                         type: string
 *                       problemAcceptance:
 *                         type: string
 *                       problemTemplate:
 *                         type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Failed to Login due to internal server error
 */
problemRouter.get("/problems", getAllProblemController);
/**
 * @swagger
 * /api/problem/{id}:
 *   get:
 *     tags:
 *       - problem
 *     summary: Problem API
 *     description: To get problem using problem id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Problem Id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 problemId:
 *                   type: integer
 *                 problemName:
 *                   type: string
 *                 problemDescription:
 *                   type: string
 *                 problemTestCase:
 *                   type: string
 *                 problemTimeout:
 *                   type: integer
 *                 problemDifficulty:
 *                   type: string
 *                 problemAcceptance:
 *                   type: string
 *                 problemTemplate:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Failed to Login due to internal server error
 */
problemRouter.get("/problem/:id", validateProblemId(), getProblemController);

module.exports = { problemRouter: problemRouter };
