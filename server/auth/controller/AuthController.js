const { Request } = require("express");
const { Response } = require("express");
const { NextFunction } = require("express");
const { validationResult, matchedData } = require("express-validator");
const { Logger } = require("../../lib/logger/Logger");
const logger = new Logger("API-SERVER", "AuthController.js")
const { signUpService, checkEmailAvailabilityService, checkUsernameAvailabilityService } = require("../service/AuthService");

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  postSignUpController: async function (req, res, next) {
    (async () => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        const bodyData = matchedData(req);
        const username = bodyData.username;
        const firstName = bodyData.first;
        const lastName = bodyData.last;
        const email = bodyData.email;
        const password = bodyData.password;
        try {
          const user = await signUpService(username, firstName, lastName, email, password);
          return res.status(201).json({ msg: "success" });
        } catch (error) {
          if (error.type === "CLIENT_ERROR") {
            logger.error(error.msg);
            return res.status(406).json({ error: error.data });
          } else {
            logger.error(error.stack);
            return res.status(500).json({ msg: "Failed to SignUp" });
          }
        }
      } else {
        logger.error(result.array());
        return res.status(403).json({ error: result.array() });
      }
    })().catch((error) => {
      logger.error(error.stack);
      return res.status(500).json({ msg: "Failed to SignUp" });
    });
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  postLoginController: function (req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
    } else {
      logger.error(result.array());
      return res.status(403).json({ error: result.array() });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getLogoutController: function (req, res, next) {
    if (req.session && req.user) {
      req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to logout');
        } else {
          res.status(204).send();
        }
      });
    } else {
      res.end();
    }
  },
  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  getCheckUsernameAvailabilityController: function (req, res, next) {
    (async () => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        const queryData = matchedData(req);
        const username = queryData.username;
        try {
          const availablilty = await checkUsernameAvailabilityService(username);
          return res.status(200).json(availablilty);
        } catch (error) {
          if (error.type === "CLIENT_ERROR") {
            logger.error(error.msg);
            return res.status(403).json({ error: error.msg });
          } else {
            logger.error(error.stack);
            return res.status(500).json({ msg: "Internal Server Error" });
          }
        }
      } else {
        logger.error(result.array());
        return res.status(403).json({ error: result.array() });
      }
    })().catch((error) => {
      logger.error(error.stack);
      return res.status(500).json({ msg: "Internal Server Error" });
    });
  },
  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  getCheckEmailAvailabilityController: function (req, res, next) {
    (async () => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        const queryData = matchedData(req);
        const email = queryData.email;
        try {
          const availablilty = await checkEmailAvailabilityService(email);
          return res.status(200).json(availablilty);
        } catch (error) {
          if (error.type === "CLIENT_ERROR") {
            logger.error(error.msg);
            return res.status(403).json({ error: error.msg });
          } else {
            logger.error(error.stack);
            return res.status(500).json({ msg: "Internal Server Error" });
          }
        }
      } else {
        logger.error(result.array());
        return res.status(403).json({ error: result.array() });
      }
    })().catch((error) => {
      logger.error(error.stack);
      return res.status(500).json({ msg: "Internal Server Error" });
    });
  }
};
