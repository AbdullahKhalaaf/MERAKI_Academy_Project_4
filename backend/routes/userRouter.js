const express = require("express");
const {
  userRegister,
  userLogin,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
module.exports = userRouter;
