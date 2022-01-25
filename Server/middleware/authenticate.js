const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies["jwtoken"];
    if (!token) {
      return res.status(422).json({ error: "Please login " });
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verifyToken,
      "tokens.token": token,
    });
    if (!rootUser) {
      return res.status(422).json({ error: "Please login " });
    }
    req.rootUser = rootUser;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticate;
