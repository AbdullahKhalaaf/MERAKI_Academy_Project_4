const express = require("express");
const {
  createNewLike,
  deleteLikeByUserAndPost,
} = require("../controllers/likeController");
const likeRouter = express.Router();
const authentication = require("../middleware/authentication");

likeRouter.post("/:postId/newLike",  createNewLike);
likeRouter.delete("/deleteLike/:id", authentication, deleteLikeByUserAndPost);
module.exports = likeRouter;
