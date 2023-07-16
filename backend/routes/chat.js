const express = require("express");
const router = express.Router();
const {
  getChatMessages,
  createChat,
  createMessage,
  getChats,
} = require("../controllers/chat");

router.route("/getChatMessages").get(getChatMessages);
router.route("/createChat").post(createChat);
router.route("/createMessage").post(createMessage);
router.route("/getChats").get(getChats);

module.exports = router;
