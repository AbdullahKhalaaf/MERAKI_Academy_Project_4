const express = require("express");
const {
  createPost,
  getAllPosts,
  deletePostById,
  getPostById,
  updatePostById,
  getPostByUserId,
} = require("../controllers/postController");
const postRouter = express.Router();
const authentication = require("../middleware/authentication");

postRouter.post("/create",authentication, createPost);
postRouter.get("/", getAllPosts);
postRouter.delete("/deletePost/:id",  deletePostById);
postRouter.get("/:id", getPostById);
postRouter.get("/user/:id", getPostByUserId);
postRouter.put("/:id/update", updatePostById);
module.exports = postRouter;
