const bcrypt = require("bcrypt");
const saltRounds = 10;
/**
 * @description
 * Method takes in parameters hash, salt, password which we have retrieved
 * from the database. We use the salt and the password to create a new hash
 * value which is created with the password entered by the user during 
 * login and the cryptographic salt we are using. It then compares it with 
 * the hash value present in the MySQL database(created during registration).
 * If both matches then it returns true.
 * @param {String} plainTextPasswordFromUser 
 * @param {String} passwordHashFromDB 
 * @returns {Promise}
 */
async function comparePasswordHash(plainTextPasswordFromUser, passwordHashFromDB) {
    const match = await bcrypt.compare(plainTextPasswordFromUser, passwordHashFromDB);
    return match;
}
/**
 * @description
 * Method is used to generate Hash of the password. It used bcrypt to generate
 * a hash for the password using the salt rounds. 
 * This method is called during the registration of the user.
 * @param {String} passwordFromUser 
 * @returns {Promise}
 */
async function generatePasswordHash(passwordFromUser) {
    const passwordHash = await bcrypt.hash(passwordFromUser, saltRounds);
    return passwordHash;
}
module.exports = {
    comparePasswordHash: comparePasswordHash,
    generatePasswordHash: generatePasswordHash
}