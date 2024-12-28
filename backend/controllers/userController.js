const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const userLogin = (req, res) => {
  const { email, password } = req.body;

  userModel
    .findOne({ email: email.toLowerCase() })
    .populate("role")
    .then(async (result) => {
      console.log(result);

      if (!result) {
        return res.status(403).json({
          success: false,
          message:
            "The email doesn’t exist or the password you’ve entered is incorrect",
        });
      }
      console.log("password", password);
      console.log("resultPassword:", result.password);

      const hashedPassword = result.password;
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch) {
        return res.status(403).json({
          success: false,
          message:
            "The email doesn’t exist or the password you’ve entered is incorrect",
        });
      }

      const payload = {
        userId: result._id.toString(),
        userName: result.userName,
        avatar: result.avatar,
        role: {
          role: result.role.role,
          permissions: result.role.permissions,
        },
      };
      //   console.log("payload", payload);
      //   console.log("userId:", result._id.toString());
      //   console.log("userName:", result.userName);
      //   console.log("avatar: ", result.avatar);
      //   console.log("role", result.role.role);

      const options = {
        expiresIn: "5h",
      };

      const token = jwt.sign(payload, process.env.SECRET, options);

      return res.status(200).json({
        success: true,
        message: "Valid login credentials",
        token: token,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    });
};

const getAllUsers = (req, res) => {
  userModel
    .find({})
    .populate("followers")
    .populate("following")
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully.",
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    });
};

const getUserById = (req, res) => {
  userId = req.params.id;

  userModel
    .findById(userId)
    .select("-password")
    .populate("following", "userName avatar")
    .populate("followers", "userName avatar")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }
      res.status(200).json({
        success: true,
        message: " User retrieved successfully",
        user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    });
};

module.exports = { userRegister, userLogin, getAllUsers, getUserById };
