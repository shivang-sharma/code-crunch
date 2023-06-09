const cors = require('cors');

const whiteList = new Set(["http://example.com", "http://example1.com"]);
const corsOptions = {
    optionsSuccessStatus: 200, // Some leagacy browser choke on 204
    origin: function(origin, callback) {
        if (whiteList.has(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials:true
}

module.exports = {
    corsMiddleware: cors(corsOptions)
}