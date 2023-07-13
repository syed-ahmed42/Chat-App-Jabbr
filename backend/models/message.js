const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Must provide message content"],
    maxlength: [280, "Chat content must be no longer than 280 characters"],
  },
  timestamp: {
    type: Date,
    required: [true, "Must provide message content"],
  },
});

module.exports = mongoose.model("Message", messageSchema);
