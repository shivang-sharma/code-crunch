const express = require("express");
const { getCurrentUserProfileController, getProfileController, getCurrentSessionController } = require("./controller/ProfileController");
const profileRouter = express.Router();
profileRouter.get("/current_session", getCurrentSessionController)
profileRouter.get("/profile", getCurrentUserProfileController);
profileRouter.get("/profile/:id", getProfileController);
module.exports = { profileRouter: profileRouter };
