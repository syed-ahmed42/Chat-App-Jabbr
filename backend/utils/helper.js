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

const convertChatToJSON = async (chat) => {
  const messages = chat.messages;
  let decipheredMessages = [];
  const members = chat.members;
  let decipheredMembers;
  for (let i = 0; i < messages.length(); i++) {
    let msg = await messageModel.findById(messages[i]);
    decipheredMessages.push(msg);
  }
  for (let i = 0; i < members.length(); i++) {
    let member = await userModel.findById(members[i]);
    decipheredMembers.push(members);
  }
  const result = {
    messages: decipheredMessages,
    members: decipheredMembers,
  };
  return result;
};

module.exports = { getUserID };
