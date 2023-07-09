const express = require("express");
const router = express.Router();
const {
  createAccount,
  login,
  checkSessionValidity,
} = require("../controllers/auth");

router.route("/createAccount").post(createAccount);
router.route("/login").post(login);
router.route("/checkSessionValidity").get(checkSessionValidity);

module.exports = router;
