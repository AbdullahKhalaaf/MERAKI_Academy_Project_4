const express = require("express");
const {
  createNewComment,
  deleteCommentById,
  updateCommentById,
  getCommentsByPostId,
  gettAllComments,
} = require("../controllers/commentController");
const authentication = require("../middleware/authentication");

const commentRouter = express.Router();
commentRouter.post("/:postid/addComment", createNewComment);
commentRouter.delete("/:id", deleteCommentById);
commentRouter.put("/update/:id", updateCommentById);
commentRouter.get("/get/:id", getCommentsByPostId);
commentRouter.get("/getAll", gettAllComments);
module.exports = commentRouter;
