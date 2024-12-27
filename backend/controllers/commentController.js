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
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { createNewComment };
