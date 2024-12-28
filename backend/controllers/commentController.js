const commentModel = require("../models/commentSchema");
const postModel = require("../models/postSchema");

const createNewComment = (req, res) => {
  const { postId, commenter, comment } = req.body;

  const newComment = new commentModel({ postId, commenter, comment });
  newComment.save().then((newC) => {
    postModel
      .findById(postId)
      .then((post) => {
        if (!post) {
          res.status(404).json({
            success: false,
            message: "Post Not found",
          });
        }
        post.comments.push(newC._id);
        return post.save();
      })
      .then(() => {
        res.status(201).json({
          success: true,
          message: "Comment Added",
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

  //   const newComment = new commentModel({
  //     postId,
  //     commenter,
  //     comment,
  //   });
  //   newComment
  //     .save()
  //     .then((result) => {
  //       res.status(201).json({
  //         success: true,
  //         message: "comment added",
  //         comment: {
  //           content: result.content,
  //           author: result.author,
  //         },
  //       });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       res.status(409).json({
  //         success: false,
  //         message: "Server Error",
  //         error: err.message,
  //       });
  //     });
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

const updateCommentById = (req, res) => {
  const commentId = req.params.id;
  const { comment } = req.body;
  commentModel
    .findByIdAndUpdate(commentId, { comment: comment }, { new: true })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Comment not Found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Comment Updated Successfully",
        comment: result,
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

module.exports = { createNewComment, deleteCommentById , updateCommentById};
