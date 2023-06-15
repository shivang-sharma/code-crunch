const util = require("util");
class Logger {
    #serviceName;
    #fileName
    constructor(serviceName, fileName="") {
        this.#serviceName = serviceName;
        this.#fileName = fileName;
    }
    info(message) {
        const level = "INFO"
        log(this.#serviceName, this.#fileName, level, message);
    }
    error(message) {
        const level = "ERROR";
        log(this.#serviceName, this.#fileName, level, message);
    }
    warning(message) {
        const level = "WARNING";
        log(this.#serviceName,  this.#fileName, level, message);
    }
    verbose(message) {
        const level = "VERBOSE";
        log(this.#serviceName,  this.#fileName, level, message);
    }
    http(message) {
        const level = "http";
        log(this.#serviceName,  this.#fileName, level, message);
    }
}
/**
 * Milliseconds from epoch
 * @param {Number} timestamp 
 */
function formattedTimestamp(timestamp) {
    const d = new Date(timestamp);
    let formatedTimestamp = `${d.toISOString().split("T")[0]} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`
    return formatedTimestamp;
}
/**
 * 
 * @param {String} serviceName 
 * @param {String} fileName 
 * @param {String} level 
 * @param {String} message 
 */
function log(serviceName,  fileName, level, message) {
    let formattedLog;
    if (fileName.length > 0) {
        formattedLog = `[${formattedTimestamp(Date.now())}] ${serviceName} ${level}: #${fileName} ${JSON.stringify(message)}`;
    } else {
        formattedLog = `[${formattedTimestamp(Date.now())}] ${serviceName} ${level}: ${message.trim("\n")}`;
    }
    console.log(formattedLog);
}

module.exports = {
    Logger:Logger
}