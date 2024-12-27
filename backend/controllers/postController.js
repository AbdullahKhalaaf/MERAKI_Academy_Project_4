const mongoose = require("mongoose");
const postModel = require("../models/postSchema");

const createPost = (req, res) => {
  const { content, author, comments, likes } = req.body;

  const newPost = new postModel({
    content,
    author,
    comments,
    likes,
  });

  newPost
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        success: true,
        message: "Post Created",
        post: {
          content: result.content,
          author: result.author,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(409).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    });
};

const getAllPosts = (req, res) => {
  postModel
    .find({})
    .populate({
      path: "author",
      select: "userName",
    })
    .populate("likes")
    .populate("comments")
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All Posts",
        posts: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    });
};

const deletePostById = (req, res) => {
  const postId = req.params.id;
  //   console.log(req.token.id);
  // should make statment between the token and the author if matched he can delete
  // but till now i don't know ho to reach it :( )
  postModel
    .findByIdAndDelete(postId)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          success: false,
          message: `The post with ID ${postId} was not found `,
          error: err.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: "The post deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

module.exports = { createPost, getAllPosts, deletePostById };
