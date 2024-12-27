const express = require("express");
const { userRegister, userLogin,getAllUsers } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/",getAllUsers)
module.exports = userRouter;
