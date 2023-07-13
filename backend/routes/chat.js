const express = require("express");
const router = express.Router();
const { getChatMessages, createChat } = require("../controllers/chat");

router.route("/getChatMessages").get(getChatMessages);
router.route("/createChat").post(createChat);

module.exports = router;
