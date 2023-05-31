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
  postSignUpController: function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    if (USERS.find((x) => x.email === email)) {
      return res.status(403).json({ msg: "Email already exists" });
    }

    USERS.push({
      email,
      password,
      id: USER_ID_COUNTER++,
    });

    return res.json({
      msg: "Success",
    });
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  postLoginController: function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const user = USERS.find((x) => x.email === email);

    if (!user) {
      return res.status(403).json({ msg: "User not found" });
    }

    if (user.password !== password) {
      return res.status(403).json({ msg: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );

    return res.json({ token });
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getLogoutController: function (req, res, next) {},
};
