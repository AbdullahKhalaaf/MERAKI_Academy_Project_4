const express = require("express");
const { createNewComment } = require("../controllers/commentController");
const authentication = require("../middleware/authentication");

const commentRouter = express.Router();
commentRouter.post("/addComment", authentication, createNewComment);
module.exports = commentRouter;
