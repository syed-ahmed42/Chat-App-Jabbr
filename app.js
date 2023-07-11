const express = require("express");
const MongoStore = require("connect-mongo");
const sessions = require("express-session");
const app = express();
const port = 3000;
const auth = require("./backend/routes/auth");
require("dotenv").config("__dirname/.env");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

app.use(
  cookieParser(
    "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
  )
);
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: oneDay },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

const ioServer = new Server(server, {
  cors: "http://localhost:8080",
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", auth);

const start = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    ioServer.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("chat message", (msg) => {
        console.log(msg);
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
