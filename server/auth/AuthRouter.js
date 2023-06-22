const express = require("express");
const {validateUsername, validateEmail, validatePassword} = require("./util/Validator")
const {
  postSignUpController,
  postLoginController,
  getLogoutController,
  getCheckUsernameAvailabilityController,
  getCheckEmailAvailabilityController

} = require("./controller/AuthController");
const passport = require("passport");
const authRouter = express.Router();

authRouter.post("/signup", validateUsername({body:true}), validatePassword(), validateEmail(), postSignUpController);
authRouter.post("/login", validatePassword(), validateEmail(), postLoginController, passport.authenticate('local', { failureMessage: true}), (req, res) => {
  res.status(200).json("Success");
});
authRouter.get("/logout", getLogoutController);
authRouter.get("/check-username", validateUsername({query:true}), getCheckUsernameAvailabilityController);
authRouter.get("/check-email", validateEmail({query:true}), getCheckEmailAvailabilityController);

module.exports = { authRouter: authRouter };
