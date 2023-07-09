const { default: mongoose } = require("mongoose");
const asyncWrapper = require("../middlewares/asyncWrapper");
const oneDay = 1000 * 60 * 60 * 24;
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createAccount = async (req, res, next) => {
  try {
    const userExist = await userModel.find({ username: req.body.username });
    const emailExist = await userModel.find({ email: req.body.email });
    if (userExist.toString() !== "") {
      return res.status(400).send({ message: "Username is taken" });
    }
    if (emailExist.toString() !== "") {
      return res.status(400).send({ message: "Email is already registered" });
    }
    const newAccount = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRounds),
    };
    await userModel.create(newAccount);
    return res.status(200).json({ result: "Registration Successful" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user === null) {
      return res.status(400).json({ result: "User with that email not found" });
    }
    const result = bcrypt.compareSync(req.body.password, user.password);

    if (result === null) {
      return res.status(400).json({ outcome: "An error occured" });
    }
    if (result === false) {
      return res.status(400).json({ outcome: "Incorrect password" });
    }
    req.session.userId = user.id;

    if (req.cookies.doesCookieExist === undefined) {
      res.cookie("doesCookieExist", true, {
        httpOnly: false,
        //Set cookie expiry to httpOnly cookie expiry time
        expires: req.session.cookie._expires,
        secure: true,
        sameSite: "none",
      });
    }

    return res.status(200).json({ type: "Successfully logged in" });
  } catch (error) {
    console.log(error);
  }
};

const checkSessionValidity = async (req, res, next) => {
  if (req.session.userId) {
    return res.status(200).json({ outcome: "session found" });
  } else {
    return res.status(400).json({ outcome: "session not found" });
  }
};

module.exports = {
  createAccount,
  login,
  checkSessionValidity,
};
