const mongoose = require("mongoose");
const likeModel = require("../models/likeSchema");
const postModel = require("../models/postSchema");

const createNewLike = (req, res) => {
  const { postId, userId } = req.body;

  const newLike = new likeModel({ postId, userId });

  newLike
    .save()
    .then((newL) => {
      postModel
        .findById(postId)
        .then((post) => {
          if (!post) {
            // Return here to prevent further execution
            return res.status(404).json({
              success: false,
              message: "Post not found",
            });
          }

          post.likes.push(newL._id);
          return post.save().then(() => {
            // Send success response after post is updated
            res.status(201).json({
              success: true,
              message: "Like added successfully",
            });
          });
        })
        .catch((err) => {
          // Catch block for finding the post or saving the post
          console.error(err);

          // Send error response only if it hasn't been sent
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Server Error",
              error: err.message,
            });
          }
        });
    })
    .catch((err) => {
      // Catch block for saving the new like
      console.error(err);

      // Send error response only if it hasn't been sent
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error adding like",
          error: err.message,
        });
      }
    });
};

const deleteLikeByUserAndPost = (req, res) => {
  const { postId, userId } = req.body;

  likeModel
    .findOneAndDelete({ postId: postId, userId: userId })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: `No like found for Post ID ${postId} by User ID ${userId}`,
        });
      }

      postModel
        .findById(postId)
        .then((post) => {
          if (!post) {
            return res.status(404).json({
              success: false,
              message: "Post not found",
            });
          }

          post.likes = post.likes.filter(
            (likeId) => likeId.toString() !== result._id.toString()
          );

          return post.save();
        })
        .then(() => {
          res.status(200).json({
            success: true,
            message: "The Like deleted successfully",
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message,
          });
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

module.exports = { createNewLike, deleteLikeByUserAndPost };
