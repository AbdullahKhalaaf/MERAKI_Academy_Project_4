const express = require("express");
const { createPost } = require("../controllers/postController");
const postRouter = express.Router();
const authentication = require("../middleware/authentication");

postRouter.use("/create", authentication, createPost);
module.exports = postRouter;
