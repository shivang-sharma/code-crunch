const passport = require('passport');
const { DoneCallback } = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { UserModel } = require("../../persistency/models/UserModel");
const { comparePasswordHash } = require("./BcryptUtil");
const { Logger } = require("../../lib/logger/Logger")
const logger = new Logger("API-SERVER", "PassportUtil.js");
/**
 * @description
 * Custom Field credential Keys
 */
const customFields = {
    usernameField: 'email',
    passwordField: 'password',
};

/**
 * @description
 * Method is used by the passport.js to verify whether the user is valid or not.
 * This method is called during the login phase of the user. 
 * It gets the parameters username and password which then we have to compare
 * with the password present in the MySQL database if the user exists. 
 * For comparison purpose we use comparePasswordHash() method.
 * 
 * @param {String} username 
 * @param {String} password 
 * @param {DoneCallback} done 
 */
function verifyCredentialsCallback(email, password, done) {
    (async () => {
        try {
            const userInfoFromDB = await UserModel.getUserByEmail(email);
            if (userInfoFromDB.authMechanism.localeCompare("BASIC") !== 0) {
                return done({ msg: `Registered using ${userInfoFromDB.authMechanism}` })
            }
            const match = await comparePasswordHash(password, userInfoFromDB.userPassword);
            if (match) {
                return done(null, userInfoFromDB);
            } else {
                return done(null, false);
            }
        } catch (error) {
            if (error.msg === undefined) {
                logger.error(`${error.stack}`);
                return done(error);
            } else {
                logger.error(error.msg);
                return done(null, false);
            }
        }
    })();
}

const localStrategy = new LocalStrategy(customFields, verifyCredentialsCallback);
passport.use(localStrategy);

/**
 * This is used  for setting the user id as cookie in header
 */
passport.serializeUser((user, done) => {
    return done(null, user.userId);
});

/**
 * This is used  for retrieving the user id from the cookie.
 */
passport.deserializeUser(function (user, done) {
    let userId = null;
    (async () => {
        try {
            if (user.constructor.name.localeCompare("Object") === 0) {
                userId = user.userId;
            } else {
                userId = user;
            }
            const userFromDB = await UserModel.getUserById(userId);
            return done(null, userFromDB);
        } catch (error) {
            if (error.msg === undefined) {
                logger.error(`${error.stack}`);
                return done(error);
            } else {
                logger.error(error.msg);
                return done(null, false);
            }
        }

    })();
});

module.exports = {
    passport: passport
}