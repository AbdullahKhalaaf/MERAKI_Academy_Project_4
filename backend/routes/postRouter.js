const express = require("express");
const { createPost, getAllPosts } = require("../controllers/postController");
const postRouter = express.Router();
const authentication = require("../middleware/authentication");

postRouter.use("/create", authentication, createPost);
postRouter.get("/", getAllPosts);
module.exports = postRouter;
