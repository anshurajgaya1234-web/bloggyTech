const express = require("express")
const {createPost,deletePost, getAllPosts, getPost, updatePost, likePost, dislikePost, clapPost, schedulePost} = require("../../controllers/posts/postsController")
const isLoggedIn = require("../../middlewares/isLoggedIn")
const multer = require("multer");
const storage = require("../../utils/fileUpload")
const postsRouter = express.Router();
const isAccountVerified  = require("../../middlewares/isAccountVerified")

const upload = multer({storage})
//? Create post router
postsRouter.post("/",isLoggedIn,upload.single("file"),createPost);

//?GEt all post route
postsRouter.get("/",isLoggedIn,getAllPosts)

//? get a single post route
postsRouter.get("/:id",getPost);

//?Delete POST
postsRouter.delete("/:id",isLoggedIn,deletePost);

//?Update POST
postsRouter.put("/:id",isLoggedIn,updatePost);

//? Like a post

postsRouter.put("/like/:postId",isLoggedIn,likePost)

//? dislike a post
postsRouter.put("/dislike/:postId",isLoggedIn,dislikePost);

//? clap a post
postsRouter.put("/claps/:postId",isLoggedIn,clapPost)

//? schedule a post
postsRouter.put("/schedule/:postId",isLoggedIn,schedulePost)
module.exports = postsRouter;
