const mongoose = require("mongoose")
const User = require("../Users/User")
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    image:{
    type:String,
     required:true,
    },
    claps:{
        type: Number,
        default:0
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    shares:{
        type:Number,
        default:0
    },
    postViews:{
        type: Number,
        default:0,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    scheduledPublished:{
        type:Date,
        default:null,
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    dislike:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],// ek post pay multiple comments hogay

}, {
    timestamps:true
})
// convert schema into model
const Post = mongoose.model("Post",postSchema)
module.exports = Post;
//