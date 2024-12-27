const commentModel = require("../models/commentSchema");

const createNewComment = (req, res) => {
  const { postId, commenter, comment } = req.body;
  const newComment = new commentModel({
    postId,
    commenter,
    comment,
  });
  newComment
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "comment added",
        comment: {
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

module.exports = { createNewComment };
