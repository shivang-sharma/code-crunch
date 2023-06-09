const express = require("express");
const { getCurrentUserProfileController, getProfileController } = require("./controller/ProfileController");
const profileRouter = express.Router();
profileRouter.get("/profile", getCurrentUserProfileController);
profileRouter.get("/profile/:id", getProfileController);
module.exports = { profileRouter: profileRouter };
