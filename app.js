const express = require("express");
const app = express();
const port = 3000;
const auth = require("./backend/routes/auth");
require("dotenv").config("__dirname/.env");
const mongoose = require("mongoose");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", auth);
const start = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
