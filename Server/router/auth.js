const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/userSchema");
const authenticate = require("../middleware/authenticate");

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Required fields are empty" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }
    if (password != cpassword) {
      return res
        .status(422)
        .json({ error: "Password and Confirm password not match" });
    }
    const user = new User({ name, email, phone, work, password, cpassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Required fields are empty" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(422).json({ error: "User not exist" });
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(422).json({ error: "Invalid password" });
    }
    const token = await userExist.generateAuthToken();
    res
      .cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      })
      .status(201)
      .json({ user: userExist });
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", authenticate, async (req, res) => {
  res.send(req.rootUser);
});

router.get("/contact", authenticate, async (req, res) => {
  res.send(req.rootUser);
});

router.get("/logout", async (req, res) => {
  res.clearCookie("jwtoken", { path: "/" }).status(200).send("User logout");
});

module.exports = router;
