const { default: mongoose } = require("mongoose");
const asyncWrapper = require("../middlewares/asyncWrapper");
const oneDay = 1000 * 60 * 60 * 24;
require("dotenv").config();
const userModel = require("../models/user");
const chatModel = require("../models/chat");
const messageModel = require("../models/message");
const db = mongoose.createConnection(process.env.MONGO_URI);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { getUserID } = require("../utils/helper");
const chat = require("../models/chat");

const getChatMessages = async (req, res, next) => {
  return res.status(200).json({ message: ["hello", "hi", "hows it going"] });
};

const deleteMessage = async (req, res, next) => {
  const deleteResult = await messageModel.findByIdAndDelete({
    _id: req.body.id,
  });
  if (deleteResult === null) {
    return res.status(400).json({ outcome: "Message does not exist" });
  }
  return res.status(200).json({ outcome: "Message has been deleted" });
};

const getChats = async (req, res, next) => {
  const userID = await getUserID(req, res, next);
  const curUserData = await userModel
    .findById(userID, { username: 1, _id: 0 })
    .populate({
      path: "listOfChats",
      select: { _id: 1 },
      populate: [
        {
          path: "listOfMessages",
          populate: { path: "sender", select: { _id: 0, username: 1 } },
        },
        { path: "members", select: { _id: 0, username: 1 } },
      ],
    });

  res.status(200).json(curUserData);
};

const createMessage = async (req, res, next) => {
  const message = req.body.content;
  const timestamp = new Date();
  const sender = await getUserID(req, res, next);
  const chatID = req.body.chatID;

  const newMessage = {
    content: message,
    timestamp: timestamp,
    sender: sender,
  };

  createdMessage = await messageModel.create(newMessage);

  await chatModel.findByIdAndUpdate(
    chatID,
    {
      $push: { listOfMessages: createdMessage.id },
    },
    { new: true }
  );

  res.status(200).json({ outcome: "Message successfully created" });
};

const createChat = async (req, res, next) => {
  const userID = await getUserID(req, res, next);
  const otherUser = await userModel.findOne({ username: req.body.username });
  if (otherUser === null)
    return res.status(400).json({ outcome: "Username not found" });

  if (otherUser.id === userID) {
    return res
      .status(400)
      .json({ outcome: "Cannot create chat with yourself" });
  }

  const newChat = {
    listOfMessages: [],
    members: [userID, otherUser.id],
  };
  //Different permutations to determine if chat already exists
  const permOne = await chatModel.find({ members: [userID, otherUser.id] });
  const permTwo = await chatModel.find({ members: [otherUser.id, userID] });
  let createdChat;
  if (permOne.length == 0 && permTwo.length == 0) {
    createdChat = await chatModel.create(newChat);
  } else {
    return res.status(400).json({ outcome: "Chat already exists" });
  }

  console.log(
    await userModel.findByIdAndUpdate(
      userID,
      {
        $push: { listOfChats: createdChat.id },
      },
      { new: true }
    )
  );
  console.log(
    await userModel.findByIdAndUpdate(
      otherUser.id,
      {
        $push: { listOfChats: createdChat.id },
      },
      { new: true }
    )
  );

  return res.status(200).json({ outcome: "Chat successfully created" });
};

module.exports = {
  getChatMessages,
  createChat,
  createMessage,
  getChats,
  deleteMessage,
};
