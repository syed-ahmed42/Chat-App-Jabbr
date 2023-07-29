const { default: mongoose } = require("mongoose");
const userModel = require("../models/user");
const chatModel = require("../models/chat");
const messageModel = require("../models/message");
require("dotenv").config();

const db = mongoose.createConnection(process.env.MONGO_URI);

const getUserID = async (req, res, next) => {
  const curSession = await db
    .collection("sessions")
    .find({ _id: req.sessionID })
    .toArray();
  console.log(req.sessionID);
  if (curSession.length === 0) {
    return;
  }
  const sessionData = curSession[0].session;
  if (sessionData === undefined) {
    return;
  }
  const userID = JSON.parse(sessionData).userId;
  return userID;
};

const addMessageToCurrentChat = async (pMessage, pChatID, pSender) => {
  const message = pMessage;
  const timestamp = new Date();
  const sender = await userModel.findOne({ username: pSender }).lean().exec();
  if (sender === null) {
    return;
  }
  console.log(
    "This is sender received from client side in helper function addMessageToCurrentChat: " +
      pSender
  );
  console.log(
    "This is sender in helper function addMessageToCurrentChat: " + sender._id
  );

  const chatID = pChatID;

  const newMessage = {
    content: message,
    timestamp: timestamp,
    sender: sender._id,
  };

  createdMessage = await messageModel.create(newMessage);
  newMessage._id = createdMessage.id;
  await chatModel.findByIdAndUpdate(
    chatID,
    {
      $push: { listOfMessages: createdMessage.id },
    },
    { new: true }
  );
  return newMessage;
};

module.exports = { getUserID, addMessageToCurrentChat };
