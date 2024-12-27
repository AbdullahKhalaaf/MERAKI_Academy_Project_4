const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: { type: String, require: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
});
const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;
