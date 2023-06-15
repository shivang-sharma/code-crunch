const morgan = require("morgan");
const {Logger} = require("../logger/Logger")
const logger = new Logger("API-SERVER");
const stream = {
    // Use the http severity
    write: (message) => logger.http(message),
};
const morganMiddleware = morgan(
    ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :response-time[2] :res[content-length] ":referrer" ":user-agent"',
    {stream}
);
module.exports = {
    morganMiddleware:morganMiddleware
}