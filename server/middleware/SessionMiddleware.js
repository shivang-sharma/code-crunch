const session = require('express-session');
const RedisStore = require('connect-redis').default;
const {redisClient} = require('../redis/Redis');
const redisStore = new RedisStore({
    client: redisClient,
});
redisStore.set("ads", {name: "Shivang"});
module.exports = {
    sessionMiddleware: session({
        store: redisStore,
        secret: 'helloredis',
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60
        }
    }),
    /**
     * It verifies whether the user is authenticated. 
     * The request object would have isAuthenticated() method
     * defined by the passport.js that will check whether 
     * the user is authenticated or not. If it returns false it will
     * send unauthorized status code.
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    isAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}