const express = require("express");
const {
  createNewComment,
  deleteCommentById,
} = require("../controllers/commentController");
const authentication = require("../middleware/authentication");

const commentRouter = express.Router();
commentRouter.post("/addComment", authentication, createNewComment);
commentRouter.delete("/:id", authentication, deleteCommentById);
module.exports = commentRouter;
