const JWT_SECRET = "secret";
var jwt = require('jsonwebtoken');
const session = require('express-session');


module.exports = {
    authMiddleware: function (req, res, next) {
        if (!req.session || !req.session.user){
            res.status(400).json('Error not logged in');
        } else{
            next();
        }
    }

}