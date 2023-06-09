const bcrypt = require("bcrypt");

const { UserEntity } = require("../../persistency/entity/UserEntity");
const { UserModel } = require("../../persistency/models/UserModel");
const { generatePasswordHash } = require("../util/BcryptUtil");

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
                console.error(error);
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
                console.error(error);
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
                console.log(error);
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
                        console.info(result);
                        resolve(result);
                    }).catch((error) => {
                        console.error(error);
                        return reject(error);
                    })
                } catch(error) {
                    console.error(error);
                    return reject(error);
                }
            } else {
                return reject({ type: "CLIENT_ERROR", msg: "Username or Email already exists" });
            }
        })()
    });
}
/**
 * 
 * @param {String} email 
 * @param {String} password 
 * @returns {Promise}
 */
function signInService(email, password) {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const user = await UserModel.getUserByEmail(email);
                console.log(user);
                return resolve(user);
            } catch (error) {
                return reject({ type: "CLIENT_ERROR", msg: "Incorrect Email or Password" });
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
                console.log(result);
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
                console.log(result);
                return reject(error);
            }
        })();
    });
}
module.exports = {
    signUpService: signUpService,
    signInService: signInService,
    checkUsernameAvailabilityService: checkUsernameAvailabilityService,
    checkEmailAvailabilityService: checkEmailAvailabilityService
}