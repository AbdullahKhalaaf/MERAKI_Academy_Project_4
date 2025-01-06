const mongoose = require("mongoose");
const likeModel = require("../models/likeSchema");
const postModel = require("../models/postSchema");

const createNewLike = (req, res) => {
  const { userId, postId } = req.body;

  console.log("params", req.params);

  const newLike = new likeModel({ userId, postId });

  newLike.save().then((newL) => {
    postModel
      .findById(postId)
      .then((post) => {
        console.log("post", post);

        if (!post) {
          return res.status(404).json({
            success: false,
            message: "Post not found",
          });
        }

        post.likes.push(newL._id);
        return post.save().then(() => {
          res.status(201).json({
            success: true,
            message: "Like added successfully",
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "server error",
          error: err.message,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Error Adding like",
          error: err.message,
        });
      });
  });
};


const deleteLikeById = (req, res) => {
  const { postId, userId } = req.body; 

  likeModel
    .findOneAndDelete({ postId, userId })
    .then((like) => {
      if (!like) {
        return res.status(404).json({
          success: false,
          message: "Like not found",
        });
      }
      postModel
        .findById(postId)
        .then((post) => {
          if (post) {
            post.likes = post.likes.filter((likeId) => likeId !== like._id);
            post.save()
              .then(() => {
                res.status(200).json({
                  success: true,
                  message: "Like removed successfully",
                });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: "Error saving post", error: err });
              });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Error updating post", error: err });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error deleting like", error: err });
    });
};


module.exports = { createNewLike, deleteLikeById  };
