const express = require("express");
const {
  userRegister,
  userLogin,
  getAllUsers,
  getUserById,
  followUser,
} = require("../controllers/userController");
const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/follow", authentication, followUser);
module.exports = userRouter;
