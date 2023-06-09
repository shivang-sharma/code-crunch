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
  healthController: function (req, res, next) {
    console.log(req.isAuthenticated());
    console.log(req.session);
    console.log(req.session.user);
    res.json({
      msg: "hello world",
      user:req.user.json
    });
  },
};
