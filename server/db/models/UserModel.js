const { InsertQuery } = require("../../lib/queryBuilders/builders/InsertQuery");
const { WhereQuery } = require("../../lib/queryBuilders/builders/WhereQuery");
const { UserEntity } = require("../entity/UserEntity");
const { QueryData } = require("../../lib/queryBuilders/QueryData");
const { BaseModel } = require("./base/BaseModel");

class UserModel extends BaseModel {
    /**
     * 
     * @param {UserEntity} user 
     * @returns {Promise}
     */
    static save(user) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (!(user instanceof UserEntity)) {
                    return reject(Error(`UserEntity instance expected instead got ${user.constructor.name}`));
                }
                try {
                    const insertQuery = new InsertQuery()
                        .insert(new QueryData('USERNAME', user.username, String))
                        .insert(new QueryData('USER_EMAIL', user.userEmail, String))
                        .insert(new QueryData('USER_PASSWORD', user.userPassword, String))
                        .into('P_USER')
                        .build();
                    const result = await this._executeQuery(insertQuery);
                    user.userId = result.insertId;
                    user.userPassword = "";
                    resolve({
                        userId: user.userId,
                        username: user.username,
                        userEmail: user.userEmail
                    });
                } catch (error) {
                    return reject(error);
                }
            })();
        });
    }
     /**
     * Returns promise object which resolves array of user id associated with the username.
     * @param {String} username 
     * @returns {Promise}
     */
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const whereQuery = new WhereQuery()
                        .select('USER_ID')
                        .from('P_USER')
                        .where('USERNAME')
                        .equals(new QueryData('USERNAME', username, String))
                        .build();
                    const result = await this._executeQuery(whereQuery)
                    resolve(result);
                } catch (error) {
                    return reject(error);
                }
            })();
        });
    }
    /**
     * Returns promise object which resolves array of user id associated with the email address.
     * @param {String} email 
     * @returns {Promise}
     */
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const whereQuery = new WhereQuery()
                        .select('USER_ID')
                        .from('P_USER')
                        .where('USER_EMAIL')
                        .equals(new QueryData('USER_EMAIL', email, String))
                        .build();
                    const result = await this._executeQuery(whereQuery)
                    resolve(result);
                } catch (error) {
                    return reject(error);
                }
            })();
        });
    }
    /**
     * Returns promise object which resolves UserObject associated with the email address.
     * @param {String} email 
     * @returns {Promise}
     */
    static getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const whereQuery = new WhereQuery()
                        .select('USER_ID')
                        .select('USERNAME')
                        .select('USER_EMAIL')
                        .select('USER_PASSWORD')
                        .from('P_USER')
                        .where('USER_EMAIL')
                        .equals(new QueryData('USER_EMAIL', email, String))
                        .build();
                    const result = await this._executeQuery(whereQuery)
                    if (result.length == 0) {
                        return reject("User does not exists");
                    }
                    const user = new UserEntity(result[0].USER_ID);
                    user.userEmail = result[0].USER_EMAIL;
                    user.username = result[0].USERNAME;
                    user.userPassword = result[0].USER_PASSWORD;
                    return resolve(user);
                } catch (error) {
                    return reject(error);
                }
            })();
        });
    }

}
module.exports = {
    UserModel: UserModel
}