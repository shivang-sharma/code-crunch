const { UserEntity } = require("../../persistency/entity/UserEntity");
const { GoogleOAuthEntity } = require("../../persistency/entity/GoogleOAuthEntity");
const { GoogleOAuthModel } = require("../../persistency/models/GoogleOAuthModel");
const { UserModel } = require("../../persistency/models/UserModel");
const { Logger } = require("../../lib/logger/Logger");

const logger = new Logger("API-SERVER", "AuthService.js");

/**
 * 
 * @param {String} email 
 * @returns {Promise}
 */
function isEmailAvailable(email) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const result = await UserModel.findByEmail(email);
                if (result.length > 0) {
                    return resolve(false);
                } else {
                    return resolve(true);
                }
            } catch (error) {
                logger.error(error);
                return reject(error);
            }
        })();
    })
    return true;
}
/**
 * 
 * @param {Number} oauthId 
 * @param {String} email 
 * @param {String} firstName 
 * @param {String} lastName 
 * @param {String} profileURL 
 * @returns {Promise}
 */
function oauthSignLoginUpService(oauthId, email, firstName, lastName, profileURL, authMechanism, refreshToken) {
    return new Promise((resolve, reject) => {
        (async () => {
            let emailAvailable;
            try {
                emailAvailable = await isEmailAvailable(email);
            } catch (error) {
                logger.error(error.stack);
                return reject(error);
            }
            if ((emailAvailable)) {
                try {
                    const newUser = new UserEntity()
                    newUser.username = oauthId;
                    newUser.userEmail = email;
                    newUser.firstName = firstName;
                    newUser.lastName = lastName;
                    newUser.profilePhotoURL = profileURL;
                    newUser.authMechanism = authMechanism;
                    const createdUser = await UserModel.save(newUser);
                    const newOauthObject = new GoogleOAuthEntity(oauthId, refreshToken, createdUser.userId);
                    await GoogleOAuthModel.save(newOauthObject);
                    resolve(createdUser.userId);
                } catch (error) {
                    logger.error(error);
                    return reject(error);
                }
            } else {
                const result = await UserModel.findByEmail(email);
                logger.verbose(result[0]);
                resolve(result[0].USER_ID);
            }
        })()
    });
}
module.exports = {
    oauthSignLoginUpService: oauthSignLoginUpService
}