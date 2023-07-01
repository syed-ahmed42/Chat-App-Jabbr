const express = require("express");
const router = express.Router();
const { createAccount, login } = require("../controllers/auth");

router.route("/createAccount").post(createAccount);
router.route("/login").post(login);

module.exports = router;
