const express = require("express");
const { healthController } = require("./controller/HealthController");
const healthRouter = express.Router();
healthRouter.get("/health", healthController);
module.exports = { healthRouter: healthRouter };
