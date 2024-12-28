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

  postModel
    .findByIdAndDelete(postId)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          success: false,
          message: `The Post with ID ${postId} was not found.`,
        });
      }
      //   if (req.token.userId !== result.commenter.toString()) {
      //     return res.status(403).json({
      //       success: false,
      //       message: "You are not authorized to delete this Comment.",
      //     });
      //   }
      return res.status(200).json({
        success: true,
        message: "The Post deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    });
};

module.exports = { createPost, getAllPosts, deletePostById };
