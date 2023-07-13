const { default: mongoose } = require("mongoose");

require("dotenv").config();

const db = mongoose.createConnection(process.env.MONGO_URI);

const getUserID = async (req, res, next) => {
  const curSession = await db
    .collection("sessions")
    .find({ _id: req.sessionID })
    .toArray();
  console.log(req.sessionID);
  const sessionData = curSession[0].session;
  if (sessionData === undefined) {
    return;
  }
  const userID = JSON.parse(sessionData).userId;
  return userID;
};

module.exports = { getUserID };
