const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
});
const commentModel = mongoose.model("Comment", commentSchema);
module.exports =  commentModel
