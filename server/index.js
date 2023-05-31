const express = require("express");
const bodyParser = require("body-parser");

const { authRouter } = require("./auth/router");
const { healthRouter } = require("./health/router");
const { leaderboardRouter } = require("./leaderboard/router");
const { problemRouter } = require("./problem/router");
const { profileRouter } = require("./profile/router");
const { submissionRouter } = require("./submission/router");

const { migrateSchema, migrateData } = require("./db/migration");

(async () => {
  await migrateSchema();
  await migrateData();
})();

const app = express();
const port = 3000;
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const cors = require("cors");
app.use(cors());
app.use(jsonParser);

app.use("/api", authRouter);
app.use("/api", healthRouter);
app.use("/api", leaderboardRouter);
app.use("/api", problemRouter);
app.use("/api", profileRouter);
app.use("/api", submissionRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
