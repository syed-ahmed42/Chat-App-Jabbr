const express = require("express");
const router = express.Router();
const {
  getChatMessages,
  createChat,
  createMessage,
  getChats,
  deleteMessage,
  deleteChat,
} = require("../controllers/chat");

router.route("/getChatMessages").post(getChatMessages);
router.route("/createChat").post(createChat);
router.route("/createMessage").post(createMessage);
router.route("/getChats").get(getChats);
router.route("/deleteMessage").post(deleteMessage);
router.route("/deleteChat").post(deleteChat);

module.exports = router;
