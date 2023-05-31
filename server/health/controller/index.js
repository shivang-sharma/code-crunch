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
    res.json({
      msg: "hello world",
    });
  },
};
