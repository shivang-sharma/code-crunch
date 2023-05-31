const { Request } = require("express");
const { Response } = require("express");
const { NextFunction } = require("express");

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getCurrentUserProfileController: function (req, res, next) {
    const user = USERS.find((x) => x.id === req.userId);
    res.json({ user });
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getProfileController: function (req, res, next) {
    const user = USERS.find((x) => x.id === req.userId);
    res.json({ user });
  },
};
