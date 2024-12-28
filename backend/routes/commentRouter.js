const express = require("express");
const {
  createNewComment,
  deleteCommentById,
  updateCommentById,
} = require("../controllers/commentController");
const authentication = require("../middleware/authentication");

const commentRouter = express.Router();
commentRouter.post("/:postid/addComment", authentication, createNewComment);
commentRouter.delete("/:id", authentication, deleteCommentById);
commentRouter.put("/update/:id", updateCommentById);
module.exports = commentRouter;
