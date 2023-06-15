const { UserEntity } = require("../../persistency/entity/UserEntity");
const { UserModel } = require("../../persistency/models/UserModel");
const { generatePasswordHash } = require("../util/BcryptUtil");

const {Logger} = require("../../lib/logger/Logger");
const logger = new Logger("API-SERVER", "AuthService.js");
/**
 * 
 * @param {String} username 
 * @returns {Promise}
 */
function isUsernameAvailable(username) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const result = await UserModel.findByUsername(username);
                if (result.length > 0) {
                    return resolve(false);
                } else {
                    return resolve(true);
                }
            } catch (error) {
                logger.error(error);
                return resolve(error);
            }
        })();
    })
}
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
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 * @returns {Promise}
 */
function signUpService(username, email, password) {
    return new Promise((resolve, reject) => {
        (async () => {
            let usernameAvailable;
            let emailAvailable;
            try {
                usernameAvailable = await isUsernameAvailable(username);
                emailAvailable = await isEmailAvailable(email);
            } catch (error) {
                loggererror(error);
                return reject(error);
            }
            if ((usernameAvailable && emailAvailable)) {
                try {
                    const passwordHash = await generatePasswordHash(password);
                    const newUser = new UserEntity()
                    newUser.username = username;
                    newUser.userEmail = email;
                    newUser.userPassword = passwordHash;
                    UserModel.save(newUser).then((result) => {
                        resolve(result);
                    }).catch((error) => {
                        logger.error(error);
                        return reject(error);
                    })
                } catch(error) {
                    logger.error(error);
                    return reject(error);
                }
            } else {
                return reject({ type: "CLIENT_ERROR", msg: "Username or Email already exists" });
            }
        })()
    });
}
/**
 * @param {String} username 
 * @returns {Promise}
 */
function checkUsernameAvailabilityService(username) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const result = await isUsernameAvailable(username);
                if (result) {
                    resolve({ status: "success", msg: "Available" });
                } else {
                    return reject({ type: "CLIENT_ERROR", msg: "Username already exists" });
                }
            } catch (error) {
                logger.error(error);
                return reject(error);
            }
        })();
    });
}
/**
 * 
 * @param {String} email 
 * @returns {Promise}
 */
function checkEmailAvailabilityService(email) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const result = await isEmailAvailable(email);
                if (result) {
                    resolve({ status: "success", msg: "Available" });
                } else {
                    return reject({ type: "CLIENT_ERROR", msg: "Email is already associated with another username" });
                }
            } catch (error) {
                logger.error(error);
                return reject(error);
            }
        })();
    });
}
module.exports = {
    signUpService: signUpService,
    checkUsernameAvailabilityService: checkUsernameAvailabilityService,
    checkEmailAvailabilityService: checkEmailAvailabilityService
}