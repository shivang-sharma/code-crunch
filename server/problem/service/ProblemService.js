const { ProblemModel } = require("../../persistency/models/ProblemModel");
const { ProblemEntity } = require("../../persistency/entity/ProblemEntity");
const { Logger } = require("../../lib/logger/Logger");
const logger = new Logger("API-SERVER", "ProblemService.js");

module.exports = {
    /**
     * Service to retrieve all the problems
     * @returns {Promise}
     */
    getAllProblemService: function () {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const result = await ProblemModel.getAllProblem();
                    let listOfProblem = [];
                    result.forEach(problem => {
                        const newProblem = new ProblemEntity(
                            problem.PROBLEM_ID,
                            problem.PROBLEM_NAME,
                            problem.PROBLEM_DESCRIPTION,
                            problem.PROBLEM_TESTCASE,
                            problem.PROBLEM_TIMEOUT,
                            problem.PROBLEM_DIFFICULTY,
                            problem.PROBLEM_ACCEPTANCE,
                            problem.PROBLEM_TEMPLATE);
                        listOfProblem.push(newProblem);
                    });
                    resolve(listOfProblem);
                } catch (error) {
                    logger.error(error);
                    return reject(error);
                }
            })();
        })
    },
    /**
     * Service to retrive the problem with given problem id
     * @param {Number} problemId 
     * @returns {Promise}
     */
    getProblemService: function (problemId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const result = await ProblemModel.getProblem(problemId);
                    if (result.length > 0) {
                        resolve(result[0]);
                    } else {
                        return reject({ msg: "Problem Not Found" })
                    }
                } catch (error) {
                    logger.error(error);
                    return reject(error);
                }
            })();
        });
    }
}