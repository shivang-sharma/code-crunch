const Redis = require('ioredis');

const redisClient = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    username: "default", // needs Redis >= 6
    password: "my-top-secret",
    db: 0, // Defaults to 0
    showFriendlyErrorStack: true,
    maxRetriesPerRequest: 1,
    // This is the default value of `retryStrategy`
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError(err) {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
            // Only reconnect when the error contains "READONLY"
            return true; // or `return 1;`
        }
    },
});

redisClient.on('connect', () => {
    /**
     * Emits when a connection is established
     * to the Redis server.
     */
    console.log("Redis Connected ...")
});
redisClient.on('ready', () => {
    /**
     * If enableReadyCheck is true, client will
     * emit ready when the server reports that 
     * it is ready to receive commands (e.g. 
     * finish loading data from disk). Otherwise,
     * ready will be emitted immediately right after
     * the connect event.
     */
    console.log("Redis Ready ...")
});
redisClient.on('end', () => {
    /**
     * Emits after close when no more 
     * reconnections will be made, or 
     * the connection is failed to establish.
     */
    console.log("Redis End ...")
});
redisClient.on('reconnecting', () => {
    /**
     * Emits after close when a reconnection will be
     * made. The argument of the event is the time 
     * (in ms) before reconnecting.
     */
    console.log("Redis Reconnecting ...")
});
redisClient.on('error', (err) => {
    /**
     * Emits when an error occurs while connecting.
     * However, ioredis emits all error events 
     * silently (only emits when there's at least 
     * one listener) so that your application 
     * won't crash if you're not listening to the
     * error event.
     */
    console.log("Redis Error ...", err);
});
redisClient.on('close', (err) => {
    /**
     * Emits when an established Redis server 
     * connection has closed.
     */
    console.log("Redis close ...", err);
});
redisClient.on('wait', (err) => {
    /**
     * Emits when lazyConnect is set and will wait
     * for the first command to be called before 
     * connecting.
     */
    console.log("Redis wait ...", err);
});
module.exports = {
    redisClient:redisClient
}