const express = require("express");
const { auth } = require("../middleware/middleware");
const { getCurrentUserProfileController, getProfileController } = require("./controller/index");
const profileRouter = express.Router();
profileRouter.get("/profile", auth, getCurrentUserProfileController);
profileRouter.get("/profile/:id", getProfileController);
module.exports = { profileRouter: profileRouter };
