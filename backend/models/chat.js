const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
  listOfMessages: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    required: [true, "Must provide members"],
  },
});

module.exports = mongoose.model("Chat", chatSchema);
