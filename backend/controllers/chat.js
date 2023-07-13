const { default: mongoose } = require("mongoose");
const asyncWrapper = require("../middlewares/asyncWrapper");
const oneDay = 1000 * 60 * 60 * 24;
require("dotenv").config();
const userModel = require("../models/user");
const chatModel = require("../models/chat");
const db = mongoose.createConnection(process.env.MONGO_URI);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { getUserID } = require("../utils/helper");

const getChatMessages = async (req, res, next) => {
  return res.status(200).json({ message: ["hello", "hi", "hows it going"] });
};

const createChat = async (req, res, next) => {
  const userID = await getUserID(req, res, next);
  const otherUser = await userModel.findOne({ username: req.body.username });
  if (otherUser === null)
    return res.status(400).json({ outcome: "Username not found" });
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
};
