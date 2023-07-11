const { Request } = require("express");
const { Response } = require("express");
const { NextFunction } = require("express");
const {UserModel} = require("../../persistency/models/UserModel");

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
  /**
   * 
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getCurrentSessionController: function (req, res, next) {
    UserModel.getUserById(req.user.userId).then((user)=> {
      const sessionData = {
        username: user.username,
        avatar: user.profilePhotoURL,
        email: user.userEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        usernameCreated: Number(user.username) === NaN ? true: false
      }
      res.status(200).json(sessionData);
    }).catch((error)=> {
      res.status(404).json({error:"User does not exits"});
    });
  }
};
