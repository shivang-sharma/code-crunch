const cors = require('cors');
const {Logger} = require("../lib/logger/Logger")
const logger = new Logger("API-SERVER", "CorsMiddleware.js");
const whiteList = new Set(["http://localhost:3000", "http://localhost:5000"]); 
const corsOptions = {
    optionsSuccessStatus: 200, // Some leagacy browser choke on 204
    origin: function(origin, callback) {
        if ( !origin ||whiteList.has(origin)) {
            callback(null, true);
        } else {
            logger.error(origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials:true
}

module.exports = {
    corsMiddleware: cors(corsOptions)
}