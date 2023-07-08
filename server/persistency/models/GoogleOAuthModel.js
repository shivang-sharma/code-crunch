const {Logger} = require("../../lib/logger/Logger");
const { BaseModel } = require("../models/base/BaseModel");
const {GoogleOAuthEntity} = require("../entity/GoogleOAuthEntity");
const { QueryData } = require("../../lib/queryBuilders/QueryData");
const { InsertQuery } = require("../../lib/queryBuilders/builders/InsertQuery");
const logger = new Logger("API-SERVER", "GoogleOAuthModel.js");
class GoogleOAuthModel extends BaseModel {
    /**
     * 
     * @param {GoogleOAuthEntity} googleOAuth 
     * @returns {Promise}
     */
    static save(googleOAuth) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (!(googleOAuth instanceof GoogleOAuthEntity)) {
                    logger.error(`GoogleOAuthEntity instance expected instead got ${googleOAuth.constructor.name}`);
                    return reject(Error(`GoogleOAuthEntity instance expected instead got ${googleOAuth.constructor.name}`));
                }
                try {
                    const insertQuery = new InsertQuery()
                        .insert(new QueryData('GOOGLE_OAUTH_ID', googleOAuth.oauthUserId, String))
                        .insert(new QueryData('GOOGLE_OAUTH_REFRESH_TOKEN', googleOAuth.refreshToken, String))
                        .insert(new QueryData('USER_ID', googleOAuth.userId, String))
                        .into('P_GOOGLE_OAUTH')
                        .build();
                    const result = await this._executeQuery(insertQuery);
                    logger.verbose(result);
                    resolve({
                        ...googleOAuth
                    });
                } catch (error) {
                    logger.error(`${error.stack}`);
                    return reject(error);
                }
            })();
        });
    }
}
module.exports = {
    GoogleOAuthModel:GoogleOAuthModel
}