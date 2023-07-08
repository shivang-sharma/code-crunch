const { Request } = require("express");
const { Response } = require("express");
const { NextFunction } = require("express");
const { google } = require("googleapis");
const { Logger } = require("../../lib/logger/Logger");
const logger = new Logger("API-SERVER", "OAuthController.js")
const { oauthSignLoginUpService } = require("../service/OAuthService");

/**
 * Google OAuth Configuration
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
google.options({
  auth: oauth2Client
})
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
const authorizationUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  /** Pass in the scopes array defined above.
    * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
  scope: scopes,
  // Enable incremental authorization. Recommended as a best practice.
  include_granted_scopes: true
});

/**
 * GitHub OAuth Configuration
 */

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  postOauthGoogleCallbackController: function (req, res, next) {
    (async () => {
      const code = req.query.code;
      const { tokens } = await oauth2Client.getToken(code);
      const { access_token, refresh_token } = tokens;
      oauth2Client.setCredentials(tokens);
      const { id, email, given_name, family_name, picture } = (await google.oauth2("v2").userinfo.get()).data;
      const userId = await oauthSignLoginUpService(id, email, given_name, family_name, picture, "GOOGLE", refresh_token);
      logger.verbose(userId);
      req.session.regenerate(function (err) {
        if (err) console.log(err);
        req.session.passport = {
          user: {
            userId: userId,
            accessToken: access_token
          }
        }
        req.session.save(function (err) {
          if (err) console.log(err);
          res.redirect("http://localhost:3000/home");
        });
      });
    })().catch((error) => {
      logger.error(error.stack);
    })
  },

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  postOauthGoogleLoginController: function (req, res, next) {
    res.writeHead(302, { "Location": authorizationUrl });
    res.end();
  },
   /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
   postOauthGitHubCallbackController: function (req, res, next) {
    (async () => {
      const code = req.query.code;
      const { tokens } = await oauth2Client.getToken(code);
      const { access_token, refresh_token } = tokens;
      oauth2Client.setCredentials(tokens);
      const { id, email, given_name, family_name, picture } = (await google.oauth2("v2").userinfo.get()).data;
      const userId = await oauthSignUpService(id, email, given_name, family_name, picture, "GOOGLE", refresh_token);
      logger.verbose(userId);
      req.session.regenerate(function (err) {
        if (err) console.log(err);
        req.session.passport = {
          user: {
            userId: userId,
            accessToken: access_token
          }
        }
        req.session.save(function (err) {
          if (err) console.log(err);
          res.redirect("http://localhost:3000/home");
        });
      });
    })().catch((error) => {
      logger.error(error.stack);
    })
  },

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  postOauthGitHubLoginController: function (req, res, next) {
    res.writeHead(301, { "Location": authorizationUrl });
    res.end();
  }
};
