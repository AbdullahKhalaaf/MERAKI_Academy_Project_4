const express = require("express");
const {
  createNewLike,
  deleteLikeById ,
} = require("../controllers/likeController");
const likeRouter = express.Router();
const authentication = require("../middleware/authentication");

likeRouter.post("/:postId/newLike",  createNewLike);
likeRouter.delete("/deleteLike/:id", deleteLikeById );
module.exports = likeRouter;
