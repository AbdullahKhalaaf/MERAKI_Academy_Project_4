const likeModel = require("../models/likeSchema")

const createNewLike = (req,res)=>{
    const { postId } = req.body;
    console.log(req.body);
    
    likeModel.findOne({postId })
    .then((result)=>{
        if(result){
            return res.status(500).json({
                success: false,
          message: "You have already liked this post.",
            })
        }
        const newLike = new likeModel({ userId, postId });
        newLike.save()
        .then((result)=>{
            console.log(result);
            
        }).catch((err)=>{
            console.log();
            
        })
    })
    
}