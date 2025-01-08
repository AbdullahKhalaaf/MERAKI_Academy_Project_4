const mongoose = require("mongoose");
const postModel = require("../models/postSchema");
const { post } = require("../routes/userRouter");

const createPost = (req, res) => {
  const { content, author, comments, likes, images } = req.body;

  const newPost = new postModel({
    content,
    author,
    comments,
    likes,
    images,
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
          images: result.images,
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
      select: "userName avatar",
    })
    .populate("likes")
    .populate({
      path: "comments",
      populate: {
        path: "commenter",
        select: "userName avatar",
      },
    })
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

const getPostById = (req, res) => {
  postId = req.params.id;

  postModel
    .findById(postId)
    .populate({ path: `author`, select: `userName avatar` })
    .populate({
      path: `likes`,
      populate: {
        path: `userId`,
        select: `userName avatar`,
      },
    })
    .populate({
      path: `comments`,
      select: `comment`,
      populate: {
        path: `commenter`,
        select: `userName avatar`,
      },
    })

    .then((post) => {
      if (!post) {
        return res.status(404).json({
          success: false,
          message: `Post with ID ${postId} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        post: post,
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

const getPostByUserId = (req, res) => {
  authorId = req.params.id;

  postModel
    .find({ author: authorId })
    .populate({ path: `author`, select: `userName avatar` })
    .populate({
      path: `likes`,
      populate: {
        path: `userId`,
        select: `userName avatar`,
      },
    })
    .populate({
      path: `comments`,
      select: `comment`,
      populate: {
        path: `commenter`,
        select: `userName avatar`,
      },
    })

    .then((post) => {
      if (!post) {
        return res.status(404).json({
          success: false,
          message: `Post with ID ${authorId} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        post: post,
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

const updatePostById = (req, res) => {
  const postId = req.params.id;

  const { content } = req.body;
  postModel
    .findByIdAndUpdate(postId, { content: content }, { new: true })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Post Not Found",
        });
      }
      res.status(201).json({
        success: true,
        message: "Post Updated Successfully",
        post: result,
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
  createPost,
  getAllPosts,
  deletePostById,
  getPostById,
  updatePostById,
  getPostByUserId,
};
