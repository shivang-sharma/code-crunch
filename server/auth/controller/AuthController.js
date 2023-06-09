const { Request } = require("express");
const { Response } = require("express");
const { NextFunction } = require("express");
const { validationResult, matchedData } = require("express-validator");
const { signUpService, signInService, checkEmailAvailabilityService, checkUsernameAvailabilityService } = require("../service/AuthService");

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
        const email = bodyData.email;
        const password = bodyData.password;
        console.log(password);
        try {
          const user = await signUpService(username, email, password);
          return res.status(201).json({ msg: "success" });
        } catch (error) {
          console.error(error);
          if (error.type === "CLIENT_ERROR") {
            return res.status(406).json({ error: error.msg });
          } else {
            return res.status(500).json({ msg: "Failed to SignUp" });
          }
        }
      } else {
        console.error(result.array());
        return res.status(403).json({ error: result.array() });
      }
    })().catch((error) => {
      console.e(error);
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
        // const bodyData = matchedData(req);
        // const email = bodyData.email;
        // const password = bodyData.password;
        // try {
        //   const user = await signInService(email, password);
        //   req.session.user = user;
        //   return res.sendStatus(204);
        // } catch (error) {
        //   console.error(error);
        //   if (error.type === "CLIENT_ERROR") {
        //     return res.status(401).json({ error: error.msg });
        //   } else {
        //     return res.status(500).json({ msg: "Failed to Login" });
        //   }
        // }
      } else {
        console.error(result.array());
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
    if (req.session) {
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
          console.error(error);
          if (error.type === "CLIENT_ERROR") {
            return res.status(403).json({ error: error.msg });
          } else {
            return res.status(500).json({ msg: "Internal Server Error" });
          }
        }
      } else {
        console.error(result.array());
        return res.status(403).json({ error: result.array() });
      }
    })().catch((error) => {
      console.error(error);
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
          console.error(error);
          if (error.type === "CLIENT_ERROR") {
            return res.status(403).json({ error: error.msg });
          } else {
            return res.status(500).json({ msg: "Internal Server Error" });
          }
        }
      } else {
        console.error(result.array());
        return res.status(403).json({ error: result.array() });
      }
    })().catch((error) => {
      console.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    });
  }
};
