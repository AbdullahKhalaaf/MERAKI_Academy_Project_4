const express = require("express");
const { userRegister, userLogin } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
module.exports = userRouter;
