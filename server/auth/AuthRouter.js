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

/**
 * @swagger
 * /api/signup:
 *   post:
 *     tags:
 *       - auth
 *     summary: Signup API
 *     description: To signup a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *           example:
 *             username: codding-monk
 *             email: codding-monk@gmail.com
 *             password: CoddingMonk@2021
 *     responses:
 *       201:
 *         description: Account created successfully
 *       403:
 *         description: One or all the field submited contains invalid value
 *       406:
 *         description: Username or Email already exists
 *       500:
 *         description: Failed to SignUp due to internal server error
 *       
 */
authRouter.post("/signup", validateUsername({body:true}), validatePassword(), validateEmail(), postSignUpController);


/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Login API
 *     description: To login to a user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *           example:
 *             email: codding-monk@gmail.com
 *             password: CoddingMonk@2021
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: One or all the field submited contains invalid value
 *       500:
 *         description: Failed to Login due to internal server error
 *       
 */
authRouter.post("/login", validatePassword(), validateEmail(), postLoginController, passport.authenticate('local', { failureMessage: true}), (req, res) => {
  res.status(200).json("Success");
});

/**
 * @swagger
 * /api/logout:
 *   get:
 *     tags:
 *       - auth
 *     summary: Logout API
 *     description: To logout of the session/user account
 *     responses:
 *       204:
 *         description: Logged Out successfully
 *       400:
 *         description: Unable to logout (not logged in or some error occured)
 *       500:
 *         description: Failed to Login due to internal server error
 *       
 */
authRouter.get("/logout", getLogoutController);

/**
 * @swagger
 * /api/check-username:
 *   get:
 *     tags:
 *       - auth
 *     summary: Username Availability API
 *     description: To check the availability of the username
 *     parameters:
 *       -  name: username
 *          in: query
 *          description: Username to check availability
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       403:
 *         description: Username already exists or value sent for username field is invalid
 *       500:
 *         description: Failed to Login due to internal server error
 *       
 */
authRouter.get("/check-username", validateUsername({query:true}), getCheckUsernameAvailabilityController);

/**
 * @swagger
 * /api/check-email:
 *   get:
 *     tags:
 *       - auth
 *     summary: Email Availability API
 *     description: To check the availability of the email
 *     parameters:
 *       -  name: email
 *          in: query
 *          description: Email to check availability
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       403:
 *         description: Email already exists or value sent for email field is invalid
 *       500:
 *         description: Failed to Login due to internal server error
 *       
 */
authRouter.get("/check-email", validateEmail({query:true}), getCheckEmailAvailabilityController);

module.exports = { authRouter: authRouter };
