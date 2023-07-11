const express = require("express");
const router = express.Router();
const {
  createAccount,
  login,
  checkSessionValidity,
  logout,
} = require("../controllers/auth");

router.route("/createAccount").post(createAccount);
router.route("/login").post(login);
router.route("/checkSessionValidity").get(checkSessionValidity);
router.route("/logout").post(logout);

module.exports = router;
