class Logger {
    #serviceName;
    constructor(serviceName) {
        this.#serviceName = serviceName;
    }
    info(message) {
        const level = "INFO"
        log(this.#serviceName, level, message);
    }
    error(message) {
        const level = "ERROR";
        log(this.#serviceName, level, message);
    }
    warning(message) {
        const level = "WARNING";
        log(this.#serviceName, level, message);
    }
    verbose(message) {
        const level = "VERBOSE";
        log(this.#serviceName, level, message);
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
function log(serviceName, level, message) {
    const formattedLog = `[${formattedTimestamp(Date.now())}] ${serviceName} ${level}: ${message}`;
    console.log(formattedLog);
}

module.exports = {
    Logger:Logger
}