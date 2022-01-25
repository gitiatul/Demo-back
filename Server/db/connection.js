const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => {
    console.log("Db connected");
  })
  .catch((err) => console.log("Db not connected"));
