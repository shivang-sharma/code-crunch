const { mysqlPool } = require("../../db")
const {Logger} = require("../../../lib/logger/Logger");
const logger = new Logger("API-SERVER", "BaseModel.js");
class BaseModel {
    /**
     * To execute queries
     * @param {String} query 
     * @returns {Promise}
     */
    static _executeQuery(query){
        return new Promise((resolve, reject) => {
            mysqlPool.getConnection((err, connection) => {
                if (err) {
                    logger.error(err);
                    connection.release();
                    return reject(err);
                }
                connection.query(query, (err, result) => {
                    if (err) {
                        logger.error(err);
                        connection.release();
                        return reject(err);
                    }
                    connection.release();
				    resolve(result);   
                });
            })
        });
    }
    /**
     * To execute prepared statements
     * @param {String} query 
     * @param {Array} values 
     * @returns 
     */
    static _executePreparedQuery(query, values){
        return new Promise((resolve, reject) => {
            mysqlPool.getConnection((err, connection) => {
                if (err) {
                    logger.error(err);
                    connection.release();
                    return reject(err);
                }
                connection.query(query, values, (err, result) => {
                    if (err) {
                        logger.error(err);
                        connection.release();
                        return reject(err);
                    }
                    connection.release();
				    resolve(result);   
                });
            })
        });
    }
}
module.exports = {
    BaseModel: BaseModel
}