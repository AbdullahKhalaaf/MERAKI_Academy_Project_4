const likeModel = require("../models/likeSchema");

const createNewLike = (req, res) => {
  const { postId, userId } = req.body;

  likeModel
    .findOne({ userId, postId })
    .then((existingLike) => {
      if (existingLike) {
        return res.status(400).json({
          success: false,
          message: "You have already liked this post.",
        });
      }

      const newLike = new likeModel({ userId, postId });
      return newLike.save();
    })
    .then((result) => {
      return res.status(201).json({
        success: true,
        message: "Post liked successfully.",
        like: result,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    });
};

module.exports = { createNewLike };
