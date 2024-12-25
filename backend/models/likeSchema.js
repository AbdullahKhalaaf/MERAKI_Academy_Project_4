const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    userId: {type : mongoose.Schema.Types.ObjectId , ref : `User`}, 
    postId : {}
})