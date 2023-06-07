const {body, query, param, ValidationChain} = require("express-validator");
/**
 * 
 * @returns {ValidationChain}
 */
function validatePassword(){
    return body("password").notEmpty().escape().isString().isStrongPassword();
}
/**
 * 
 * @param {{body:Boolean, query:Boolean, param:Boolean}} options 
 * @returns {ValidationChain}
 */
function validateUsername(options={body:true, query:false, param:false}) {
    if (options.body) {
        return body("username").notEmpty().escape().isString().isAlphanumeric();
    } else if (options.query){
        return query("username").notEmpty().escape().isString().isAlphanumeric();
    } else {
        return param("username").notEmpty().escape().isString().isAlphanumeric();
    }
}
/**
 * 
 * @param {{body:Boolean, query:Boolean, param:Boolean}} options 
 * @returns {ValidationChain}
 */
function validateEmail(options={body:true, query:false, param:false}) {
    if (options.body) {
        return body("email").notEmpty().escape().isString().isEmail().normalizeEmail();
    } else if (options.query){
        return query("email").notEmpty().escape().isString().isEmail().normalizeEmail();
    } else {
        return param("email").notEmpty().escape().isString().isEmail().normalizeEmail();
    }
}
module.exports = {
    validatePassword:validatePassword,
    validateUsername:validateUsername,
    validateEmail:validateEmail
}