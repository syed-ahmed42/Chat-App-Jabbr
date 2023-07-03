const express = require("express");
const app = express();
const port = 3000;
const auth = require("./backend/routes/auth");
require("dotenv").config("__dirname/.env");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cors());

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
    });
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
