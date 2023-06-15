const { param, ValidationChain } = require("express-validator");
/**
 * 
 * @returns {ValidationChain}
 */
function validateProblemId() {
    return param("id").notEmpty().escape().isNumeric();
}
module.exports = {
    validateProblemId: validateProblemId,
}