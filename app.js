const express = require("express");
const MongoStore = require("connect-mongo");
const sessions = require("express-session");
const app = express();
const port = 3000;
const auth = require("./backend/routes/auth");
const chat = require("./backend/routes/chat");
require("dotenv").config("__dirname/.env");
const mongoose = require("mongoose");
const http = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const oldCors = "http://localhost:8080";
const newCors = "https://localhost:9001";

const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { addMessageToCurrentChat } = require("./backend/utils/helper");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const options = {
  key: fs.readFileSync("./backend/utils/server.key"),
  cert: fs.readFileSync("./backend/utils/server.cert"),
};

const server = http.createServer(options, app);

app.use(
  cookieParser(
    "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
  )
);
app.use(cors({ credentials: true, origin: newCors }));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: oneDay, sameSite: "none", secure: true },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

const ioServer = new Server(server, {
  cors: newCors,
});
module.exports = { ioServer };
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/chat", chat);

const start = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    ioServer.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("join room", (chatID) => {
        console.log("Joined room with ID: " + chatID);
        socket.join(chatID);
      });

      socket.on("leave room", (chatID) => {
        console.log("Left room with ID: " + chatID);
        socket.leave(chatID);
      });

      socket.on("send message", async (chatID, msg, sender) => {
        console.log("Sent message: " + msg + " to room: " + chatID);
        const msgObject = await addMessageToCurrentChat(msg, chatID, sender);
        msgObject.chatID = chatID;
        console.log(
          "This is the message object being sent: " + JSON.stringify(msgObject)
        );
        ioServer.to(chatID).emit("receive message", JSON.stringify(msgObject));
      });

      socket.on("delete message", async (curChatID) => {
        console.log("Received request to delete message on server side");
        ioServer.to(curChatID).emit("deleted message");
      });

      socket.on("delete contact", async (curChatID) => {
        console.log("Received request to delete chat on server side");
        ioServer.to(curChatID).emit("deleted chat");
      });
      socket.on("add contact", async () => {
        console.log("Received request to add contact on server side");
        ioServer.emit("added chat");
      });
    });
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
