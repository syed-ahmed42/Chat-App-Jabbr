const express = require("express");
const router = express.Router();
const {
  getChatMessages,
  createChat,
  createMessage,
  getChats,
  deleteMessage,
} = require("../controllers/chat");

router.route("/getChatMessages").get(getChatMessages);
router.route("/createChat").post(createChat);
router.route("/createMessage").post(createMessage);
router.route("/getChats").get(getChats);
router.route("/deleteMessage").post(deleteMessage);

module.exports = router;
