const express = require("express");
const {
  createPost,
  getAllPosts,
  deletePostById,
  getPostById,
  updatePostById,
} = require("../controllers/postController");
const postRouter = express.Router();
const authentication = require("../middleware/authentication");

postRouter.use("/create", authentication, createPost);
postRouter.get("/", getAllPosts);
postRouter.delete("/deletePost/:id", authentication, deletePostById);
postRouter.get("/:id", authentication, getPostById);
postRouter.put("/:id/update", authentication, updatePostById);
module.exports = postRouter;
