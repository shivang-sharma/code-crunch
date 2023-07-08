const { body, query, param, ValidationChain } = require("express-validator");
/**
 * 
 * @returns {ValidationChain}
 */
function validatePassword() {
    return body("password").notEmpty().escape().isString().isStrongPassword();
}
/**
 * 
 * @param {{body:Boolean, query:Boolean, param:Boolean}} options 
 * @returns {ValidationChain}
 */
function validateUsername(options = { body: true, query: false, param: false }) {
    if (options.body) {
        return body("username").notEmpty().escape().isString().isAlphanumeric();
    } else if (options.query) {
        return query("username").notEmpty().escape().isString().isAlphanumeric();
    } else {
        return param("username").notEmpty().escape().isString().isAlphanumeric();
    }
}
function validateFirst(options = { body: true, query: false, param: false }) {
    if (options.body) {
        return body("first").notEmpty().escape().isString().isAlpha();
    } else if (options.query) {
        return query("first").notEmpty().escape().isString().isAlpha();
    } else {
        return param("first").notEmpty().escape().isString().isAlpha();
    }
}
function validateLast(options = { body: true, query: false, param: false }) {
    if (options.body) {
        return body("last").notEmpty().escape().isString().isAlpha();
    } else if (options.query) {
        return query("last").notEmpty().escape().isString().isAlpha();
    } else {
        return param("last").notEmpty().escape().isString().isAlpha();
    }
}
/**
 * 
 * @param {{body:Boolean, query:Boolean, param:Boolean}} options 
 * @returns {ValidationChain}
 */
function validateEmail(options = { body: true, query: false, param: false }) {
    if (options.body) {
        return body("email").notEmpty().escape().isString().isEmail().normalizeEmail();
    } else if (options.query) {
        return query("email").notEmpty().escape().isString().isEmail().normalizeEmail();
    } else {
        return param("email").notEmpty().escape().isString().isEmail().normalizeEmail();
    }
}
module.exports = {
    validatePassword: validatePassword,
    validateUsername: validateUsername,
    validateEmail: validateEmail,
    validateFirst: validateFirst,
    validateLast: validateLast
}