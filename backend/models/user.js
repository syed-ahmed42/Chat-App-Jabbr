const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Must provide username"],
    trim: true,
    unique: true,
    maxlength: [20, "Username can not be more than 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Must provide email"],
    trim: true,
    unique: true,
    maxlength: [50, "Email can not be more than 50 characters"],
  },
  password: {
    type: String,
    required: [true, "Must provide password"],
  },
});

module.exports = mongoose.model("User", userSchema);
