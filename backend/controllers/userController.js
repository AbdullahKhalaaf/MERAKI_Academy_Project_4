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
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { userRegister };
