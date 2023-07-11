const express = require("express");
const {
  getOauthGoogleCallbackController,
  getOauthGoogleLoginController,
  getOauthGitHubCallbackController,
  getOauthGitHubLoginController

} = require("./controller/OAuthController");
const oauthRouter = express.Router();

/**
 * @swagger
 * /google/callback:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       value:
 *                         type: string
 *                       msg:
 *                         type: string
 *                       path:
 *                         type: string
 *                       location:
 *                         type: string
 *                
 *       406:
 *         description: Username or Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 username:
 *                   type: boolean
 *                   description: If true then username already exists
 *                 email:
 *                   type: boolean
 *                   description: If true then username already exists
 *             example:
 *               msg: Username or Email already exists
 *               username: false
 *               email: false
 *       500:
 *         description: Failed to SignUp due to internal server error
 *       
 */
oauthRouter.get("/google/callback", getOauthGoogleCallbackController);

oauthRouter.get("/google/login_signup", getOauthGoogleLoginController);

/**
 * @swagger
 * /github/callback:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       value:
 *                         type: string
 *                       msg:
 *                         type: string
 *                       path:
 *                         type: string
 *                       location:
 *                         type: string
 *                
 *       406:
 *         description: Username or Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 username:
 *                   type: boolean
 *                   description: If true then username already exists
 *                 email:
 *                   type: boolean
 *                   description: If true then username already exists
 *             example:
 *               msg: Username or Email already exists
 *               username: false
 *               email: false
 *       500:
 *         description: Failed to SignUp due to internal server error
 *       
 */
oauthRouter.get("/github/callback", getOauthGitHubCallbackController);
oauthRouter.get("/github/login_signup", getOauthGitHubLoginController);

module.exports = { oauthRouter: oauthRouter };
