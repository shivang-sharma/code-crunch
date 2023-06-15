const { BaseModel } = require("./base/BaseModel");
const {Logger} = require("../../lib/logger/Logger");
const logger = new Logger("API-SERVER", "ProblemModel.js");
class ProblemModel extends BaseModel {
    static getAllProblem() {
        return new Promise((resolve, reject) => {
            (async ()=> {
                try {
                    const getAllProblemQuery = "SELECT PROBLEM_ID, PROBLEM_NAME, PROBLEM_DESCRIPTION, PROBLEM_TESTCASE, PROBLEM_TIMEOUT, PROBLEM_DIFFICULTY, PROBLEM_ACCEPTANCE, PROBLEM_TEMPLATE FROM P_PROBLEM";
                    const result = await this._executeQuery(getAllProblemQuery);
                    resolve(result);
                } catch(error) {
                    logger.error(error);
                    return reject(error);
                }
            })();
        })
    }
    static getProblem(problemId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const getProblemQuery = `SELECT PROBLEM_ID, PROBLEM_NAME, PROBLEM_DESCRIPTION, PROBLEM_TESTCASE, PROBLEM_TIMEOUT, PROBLEM_DIFFICULTY, PROBLEM_ACCEPTANCE, PROBLEM_TEMPLATE FROM P_PROBLEM WHERE PROBLEM_ID = ?`;
                    const result = await this._executePreparedQuery(getProblemQuery, [problemId]);
                    resolve(result);
                } catch(error) {
                    logger.error(error);
                    return reject(error);
                }
            })();
        });
    }
}
module.exports = {
    ProblemModel:ProblemModel
}