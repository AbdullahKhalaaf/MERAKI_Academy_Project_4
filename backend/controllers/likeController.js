const likeModel = require("../models/likeSchema");
const postModel = require("../models/postSchema");
const createNewLike = (req, res) => {
  // const postID = req.params.id;
  const { postId, userId } = req.body;
  //   console.log("postID", postID);

  const newLike = new likeModel({ postId, userId });
  newLike.save().then((newL) => {
    postModel
      .findById(postId)
      .then((post) => {
        if (!post) {
          res.status(404).res.json({
            success: false,
            message: "Post not Found",
          });
        }
        post.likes.push(newL._id);
        return post.save();
      })
      .then(() => {
        res.status(201).json({
          success: true,
          message: "like added",
        });
      })
      .catch((err) => {
        console.log(err);

        res.status(500).json({
          success: false,
          message: "server Error",
          error: err.message,
        });
      });
  });
  //   likeModel
  //     .findOne({ userId, postId })
  //     .then((existingLike) => {
  //       if (existingLike) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "You have already liked this post.",
  //         });
  //       }

  //       const newLike = new likeModel({ userId, postId });
  //       return newLike.save();
  //     })
  //     .then((result) => {
  //       return res.status(201).json({
  //         success: true,
  //         message: "Post liked successfully.",
  //         like: result,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return res.status(500).json({
  //         success: false,
  //         message: "Server Error",
  //         error: err.message,
  //       });
  //     });
};

const deleteLikeById = (req, res) => {
  const likeId = req.params.id;

  likeModel
    .findByIdAndDelete(likeId)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          success: false,
          message: `The Like with ID ${likeId} was not found.`,
        });
      }

      return res.status(200).json({
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
};
module.exports = { createNewLike, deleteLikeById };
