const express = require("express");
const compression = require("compression")
const helmet = require("helmet")
const hpp = require("hpp")
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const {morganMiddleware} = require("./lib/logger/MorganWrapper");
const {corsMiddleware} = require("./middleware/CorsMiddleware")
const {sessionMiddleware} = require("./middleware/SessionMiddleware");
const {authenticationMiddleware} = require("./middleware/Middleware");
const {Logger} = require("./lib/logger/Logger");
const logger = new Logger("API-SERVER", "app.js");
const {passport} = require("./auth/util/PassportUtil")

const { authRouter } = require("./auth/AuthRouter");
const { healthRouter } = require("./health/HealthRouter");
const { leaderboardRouter } = require("./leaderboard/LeaderboardRouter");
const { problemRouter } = require("./problem/ProblemRouter");
const { profileRouter } = require("./profile/ProfileRouter");
const { submissionRouter } = require("./submission/SubmissionRouter");

const { migrateSchema, migrateData } = require("./persistency/migration");

/**
 * Schema and Data migration
 */
(async () => {
  await migrateSchema();
  await migrateData();
})();

const app = express();
const port = 5000;

/**
 * Attaching Middlewares
 */
app.disable('x-powered-by');
app.use(compression());
app.use(helmet());
app.use(morganMiddleware);
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(hpp());
app.options('*', corsMiddleware);
app.use(corsMiddleware);

/**
 * We need a way to store user data between HTTP requests and sessions
 * helps us to do so.When a user visits our site, it creates a new session
 * for the user and assigns them a cookie. Next time the user comes to the site
 * the cookie is checked and the session id which is stored in the cookie is
 * retrieved and searched in the session store. Session store is a place where
 * you store all our data regarding your session. Here we are using Redis as
 * the place where we can store sessions.The table will be automatically 
 * created when the server side code is run.
 */
app.use(sessionMiddleware);

/**
 * This is used to initialize the passport.js whenever a 
 * route request is called.
 */
app.use(passport.initialize());
/**
 * This acts as a middleware to alter the request object and 
 * change the ‘user’ value that is currently the 
 * session id (from the client cookie).
 */
app.use(passport.session());

/**
 * Attaching Routers
 */

const options = {
  definition: {
    openapi: "3.0.0",
    failOnErrors: true,
    info: {  
        title:'API',  
        version:'1.0.0'  
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ],
    tags: [
      {
        name:"auth",
        description: "Auth related endpoints"
      }, 
      {
        name: "problem",
        description: "Problems related endpoints"
      },
      {
        name: "health",
        description: "Service health related endpoints"
      }
    ]

},  
  apis: ['./**/**Router.js'], // files containing annotations as above
}  
const swaggerDocs = swaggerJsdoc(options);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));
app.use("/api", authRouter);
app.use("/api", healthRouter);
app.use("/api", authenticationMiddleware, leaderboardRouter);
app.use("/api", authenticationMiddleware, problemRouter);
app.use("/api", authenticationMiddleware, profileRouter);
app.use("/api", authenticationMiddleware, submissionRouter);

app.listen(port, () => {
  logger.verbose(`REST Server listening on port ${port}`);
});