const userModel = require("../models/userSchema");

const userRegister = (req, res) => {
  const { userName, email, password, role, avatar, following, followers } =
    req.body;
  const newUser = new userModel({
    userName,
    email,
    password,
    role,
    avatar,
    following,
    followers,
  });
  newUser
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Account Created Successfully",
        author: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(409).json({
        success: false,
        message: "The email already exists",
      });
    });
};

module.exports = { userRegister };
