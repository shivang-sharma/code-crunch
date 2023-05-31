const express = require("express");

const leaderboardRouter = express.Router();
leaderboardRouter.get("/leaderboard");
module.exports = { leaderboardRouter: leaderboardRouter };
