const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 4000;

require("./db/connection");
app.use(express.json());
app.use(cookieParser());
app.use(require("./router/auth"));

app.listen(port, () => {
  console.log(`Server running on port - ${port}`);
});
