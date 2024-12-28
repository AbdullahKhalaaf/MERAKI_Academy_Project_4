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

const deleteCommentById = (req, res) => {
  const commentId = req.params.id;
  console.log("Token User ID:", req.token.userId);

  commentModel
    .findByIdAndDelete(commentId)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          success: false,
          message: `The Comment with ID ${commentId} was not found.`,
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
        message: "The Comment deleted successfully",
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

module.exports = { createNewComment, deleteCommentById };
