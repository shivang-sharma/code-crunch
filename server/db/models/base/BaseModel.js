const { mysqlPool } = require("../../db")

class BaseModel {
    static _executeQuery(query){
        return new Promise((resolve, reject) => {
            mysqlPool.getConnection((err, connection) => {
                if (err) {
                    console.error(err);
                    connection.release();
                    return reject(err);
                }
                connection.query(query, (err, result) => {
                    if (err) {
                        console.error(err);
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