const express = require("express");
const {
  createPost,
  getAllPosts,
  deletePostById,
} = require("../controllers/postController");
const postRouter = express.Router();
const authentication = require("../middleware/authentication");

postRouter.use("/create", authentication, createPost);
postRouter.get("/", getAllPosts);
postRouter.delete("/:id", deletePostById);
module.exports = postRouter;
