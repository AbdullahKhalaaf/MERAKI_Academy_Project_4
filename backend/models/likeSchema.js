const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

const likeModel = mongoose.model("Like",likeSchema)
module.exports = likeModel