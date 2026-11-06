const asnyncHandler = require("express-async-handler");
const Post = require("../../models/Posts/Post")
const Comment = require("../../models/Comments/Comment");

//@desc Create a new Comment
//@route POST /api/v1/comments/:postId  (when you are creating a resource on server it is always a post route)
//@access private
exports.createComment = asnyncHandler(async (req,resp)=>{
    //Get the payload
    const {message} = req.body
    // Get the post id
    const postId = req.params.postId
    //create a comment
    const comment = await Comment.create({message,author:req?.userAuth?._id,postId})
    //Associate comment with post
await Post.findByIdAndUpdate(postId,
    {$push:{comments:comment._id}},
    {new:true})
    resp.status(201).json({status:"success",message:"Comment successfully created!",comment})
})

//@desc Delete Comment
//@route DELETE/API/V1/Comment/:commentId
//@access private

exports.deleteComment = asnyncHandler(async (req,resp) =>{
    //!Get the comment id to be deleted
    const commentId = req.params.commentId;
    await Comment.findByIdAndDelete(commentId);
    resp.status(201).json({
        status:"success",
        message:"Comment successfully deleted!",
      
    });
})
//@desc Update comment
//@route UPDATE/api/v1/comment/:commentId
//@access private
exports.updateComment = asnyncHandler(async (req,resp)=>{


//! get the comment id to be deleted
const commentId = req.params.commentId;
//! Get messaage
const message = req.body.message;

const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {message},
    {new : true, runValidators:true}
);
resp.status(201).json({
    status:"success",
    message:"Comment successfully updated!",
    updatedComment : updatedComment.message
})
})