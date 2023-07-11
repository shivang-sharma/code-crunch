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
const googleAuthorizationUrl = oauth2Client.generateAuthUrl({
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
  getOauthGoogleCallbackController: function (req, res, next) {
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
  getOauthGoogleLoginController: function (req, res, next) {
    res.writeHead(302, { "Location": googleAuthorizationUrl });
    res.end();
  },
  
  /**
  *
  * @param {Request} req
  * @param {Response} res
  * @param {NextFunction} next
  */
  getOauthGitHubCallbackController: function (req, res, next) {
    (async () => {
      const code = req.query.code;
      const { access_token, scope } = await getGitHubAccessToken(code);
      const { id, avatar_url, name } = await getGitHubUser(access_token);
      const firstName = String(name).split(" ")[0];
      const lastName = String(name).split(" ")[1] === undefined ? "" : String(name).split(" ")[1];
      const emailInfo = await getGitHubUserEmail(access_token);
      const userId = await oauthSignLoginUpService(id, emailInfo.email, firstName, lastName, avatar_url, "GITHUB", "");
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
  getOauthGitHubLoginController: function (req, res, next) {
    const gitHubAuthorizationURL = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`;
    res.writeHead(301, { "Location": gitHubAuthorizationURL });
    res.end();
  }
};
/**
 * 
 * @param {String} code 
 * @returns 
 */
async function getGitHubAccessToken(code) {
  const postGitHubURL = `https://github.com/login/oauth/access_token`;
  const postBody = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code,
    redirect_uri: process.env.GITHUB_REDIRECT_URI
  }
  const response = await fetch(postGitHubURL, {
    method: "POST",
    body: JSON.stringify(postBody),
    headers: {
      "accept": "application/json",
      "content-type": "application/json"
    }
  });
  const tokenResponse = await response.json();
  return tokenResponse;
}
/**
 * 
 * @param {String} accessToken 
 * @returns 
 */
async function getGitHubUser(accessToken) {
  const uri = `https://api.github.com/user`;
  const response = await fetch(uri, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  const responseJson = await response.json();
  return responseJson;
}
/**
 * 
 * @param {String} accessToken 
 * @returns 
 */
async function getGitHubUserEmail(accessToken) {
  const uri = "https://api.github.com/user/emails";
  const response = await fetch(uri, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  const responseJson = await response.json();
  return responseJson.find((email) => {
    return email.primary === true;
  });
}