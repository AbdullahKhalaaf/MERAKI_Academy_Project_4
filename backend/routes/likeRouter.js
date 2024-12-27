const express = require("express");
const { createNewLike } = require("../controllers/likeController");
const likeRouter = express.Router();
const authentication = require("../middleware/authentication");

likeRouter.post("/newLike", authentication, createNewLike);
module.exports = likeRouter;
