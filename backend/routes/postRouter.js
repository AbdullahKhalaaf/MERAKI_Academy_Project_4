const express = require("express")
const {createPost} = require("../controllers/postController")
const postRouter = express.Router();


postRouter.use("/create",createPost)
module.exports = postRouter