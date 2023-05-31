const express = require("express");
const {
  postSignUpController,
  postLoginController,
  getLogoutController,
} = require("./controller/index");
const authRouter = express.Router();
authRouter.post("/signup", postSignUpController);
authRouter.get("/login", postLoginController);
authRouter.get("/logout", getLogoutController);

module.exports = { authRouter: authRouter };
