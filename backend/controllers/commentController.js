const commentModel = require("../models/commentSchema");
const postModel = require("../models/postSchema");
const { post } = require("../routes/userRouter");

const createNewComment = (req, res) => {
  const { postId, commenter, comment } = req.body;

  // if (!postId || !commenter || !comment) {
  //   console.log("Validation Error: Missing required fields");
  //   return res.status(400).json({
  //     success: false,
  //     message: "All fields are required",
  //   });
  // }

  const newComment = new commentModel({ postId, commenter, comment });

  newComment
    .save()
    .then((newC) => {
      postModel
        .findById(postId)
        .then((post) => {
          if (!post) {
            console.log(`Post Not Found: postId=${postId}`);
            res.status(404).json({
              success: false,
              message: `Post with ID ${postId} not found`,
            });
          }

          post.comments.push(newC._id);
          post.save();
        })
        .then(() => {
          console.log(`Comment Added Successfully: commentId=${newC._id}`);
          res.status(201).json({
            success: true,
            message: "Comment Added",
          });
        })
        .catch((err) => {
          console.error("Error while saving post:", err.message);
          res.status(500).json({
            success: false,
            message: "Error while updating post with the new comment",
            error: err.message,
          });
        });
    })
    .catch((err) => {
      console.error("Error while saving comment:", err.message);
      res.status(500).json({
        success: false,
        message: "Error while creating new comment",
        error: err.message,
      });
    });
};

const gettAllComments = (req, res) => {
  commentModel
    .find({})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCommentsByPostId = (req, res) => {
  const postId = req.params.id;

  postModel
    .findById(postId)
    .populate({
      path: "comments",
      select: "comment commenter",
      populate: {
        path: "commenter",
        select: "userName avatar",
      },
    })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: `Post with ${postId} not found`,
        });
      }

      console.log("result", result);
      res.status(200).json({
        success: true,
        message: "Comment retrieved successfully",
        data: result,
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

const deleteCommentById = (req, res) => {
  const commentId = req.params.id;
  

  commentModel
    .findByIdAndDelete(commentId)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          success: false,
          message: `The Comment with ID ${commentId} was not found.`,
        });
      }
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

module.exports = {
  createNewComment,
  deleteCommentById,
  updateCommentById,
  getCommentsByPostId,
  gettAllComments,
};
