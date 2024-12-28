const express = require("express");
const {
  createNewLike,
  deleteLikeById,
} = require("../controllers/likeController");
const likeRouter = express.Router();
const authentication = require("../middleware/authentication");

likeRouter.post("/newLike", authentication, createNewLike);
likeRouter.delete("/deleteLike/:id", authentication, deleteLikeById);
module.exports = likeRouter;
