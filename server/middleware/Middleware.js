module.exports = {
    authenticationMiddleware: function (req, res, next) {
        if (!req.isAuthenticated() || !req.session || !req.session.passport.user){
            res.status(400).json('Error not logged in');
        } else{
            next();
        }
    }

}