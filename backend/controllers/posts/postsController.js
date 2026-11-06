const asyncHandler = require("express-async-handler")
const User = require("../../models/Users/User")
const Category = require("../../models/Categories/Category")
const Post = require("../../models/Posts/Post")

//@desc Create a new post
//@route POST /api/v1/posts
//@access private

exports.createPost = asyncHandler(async(req,resp,next) =>{//req obj me ek attribute milkar ban jayega jiska nam hoga file apnay app hi available ho jayega

    //Get the payload(post may jo data add hona hai vo client kay req say fetch karna hai)
    const {title,content,categoryId} = req.body;

    // check if the post is present
    const postFound = await Post.findOne({title})// jab key value same then direct use key,and post return karega promise
    if(postFound){
        let error = new Error("post already existing")
        next(error);
        return;
    }
    // create post object
    const post = await Post.create({title,
        content,
        category:categoryId,
        author:req?.userAuth?._id,
       image:req.file.path // jab apka multer file ko upload kar dega toh apkay req obj kay andar ek attribute add kar deta hai i.e file and ther will be a property with file i.e path
    })//id chaiye hogi aur jab login say pass hue hogay toh user nay pass kari hogi req.userAuth may id pass kari hogi
  

    //upadate user by adding post in it
  const user =await User.findByIdAndUpdate(req?.userAuth?._id,{$push:{posts:post._id}},{new:true})// ye methods 3 argument 1.userId,2 obj hoga jo batayega khya update hona hai 3.$push(mongoose operator)
     //$push:{posts:post._id} this line means push kar do post._id ko posts array may jakar
     // khya kha raha hai line ?user model may jao user model kay andar dhundo particular id wala user, us id wala userr may push kar do post_id kar do post array kau andar pudh kar do
    // new true means agar future may apko ye user object obtain karna ho toh new kay karan ye apka updated object mil jayega
    
    // update category by adding post init
    const catg = await Category.findByIdAndUpdate(
        categoryId,
        {$push:{posts:post._id}},
        {new :true}
    );
   // send the response 
    resp.json({
        status:"success",
        message:"Post successfully created",
        post,
        user,
        catg
    })
    console.log("File uploaded",req.file)
})

//@desc Get All Posts
//@route GET/api/v1/posts
//@access public

//mujhe unkay post nahi dikhenay chaiye jinhonay mujhe block kara hai
//post vohi dikhmi chaiye jinki date less than current ho ya phir jinki schedule data null ho
exports.getAllPosts = asyncHandler(async(req,resp)=>{
    //fetch all the post from db
  //const allPosts = await Post.find({}) // agar hum isay kuch na pass kare toh ye return kar dega sare post ka object so this will make sare post aa jayegi in allPost i.e an array

  //Get the current user 
  const currentUserId = req.userAuth._id;
// Get the current time
const currentDateTime = new Date();

  //get all those users who have blocked the current user
  const usersBlockingCurrentUser = await User.find({
    blockedUsers:currentUserId,// ye line kah raha hai ki vo sabhi user jiskay andar current user as a blocked user hai vo sabhi ko lay aao sare document
    // blocked user is an array and currentUser is an document but phir bhi mongoose ye apkay liye dund kay laa dega
  })
  // ye vo userIds hai jisnko kara hai current user ko block mtlb ab current user ko inkay post nahi dikhegay
  const blockingUsersIds = usersBlockingCurrentUser.map((userObj)=>userObj._id)

  // fetch those posts whose author is not blockingUserIds

  const query = {//nin means not in, and this will vo sabhi post jo current user ko nahi kiye hai  block
    author:{$nin:blockingUsersIds},//jab hum query may comma detay hai tab iska mtlb hota hai and 
    $or:[// array isliye q ki multiple conditions jaa rahe hai
        {
             scheduledPublished:{$lte:currentDateTime},
             scheduledPublished:null,
        },
    ],
};

   const allPosts = await Post.find(query).populate({
    path:"author",//apkay document ki field
    model:"User",//ye field jis original document say connected hai
    select:"email username role _id"//jo appko us model say chaiye ab uska nam
   })

  // send the response
    resp.json({
        status:"success",
        message:"All posts successfully fetched",
        allPosts,
    })
})
//@desc Get single Posts
//@route GET/api/v1/posts/:id
//@access public
exports.getPost = asyncHandler(async (req,resp) =>{
    //get the id
    const postId = req.params.id;
    // fetch the post corresponding to the id with populated author, category, and comments
    const post = await Post.findById(postId)
        .populate("author", "email username role profilePicture bio")
        .populate("category", "name")
        .populate({
            path: "comments",
            populate: {
                path: "author",
                select: "username profilePicture"
            }
        });
    if(post){
        resp.json({
            status:"success",
            message:"Post successfully fetched",
            post,
        })
    }
    else{
        resp.json({
            status:"success",
            message:"no post available for given id"
        })
    }
})

//@desc Delete Post
//@route Delelte /api/v1/posts/:id
//@access private
exports.deletePost = asyncHandler(async(req,resp) =>{
    // Get the id  
    const postId = req.params.id

    // Delete this post from the Db
    await Post.findByIdAndDelete(postId);
    // send the response
    resp.json({
        status:"success",
        message:"Post successfully deleted",

    })
})
//@desc Update Post
//@route PUT/api/v1/posts/:id
//@access private
exports.updatePost = asyncHandler(async (req,resp) =>{
    //Get the id
    const postId = req.params.id
    //Get the post from the Db
    const post = req.body;
    //Update this post in the Db
    const updatePost = await Post.findByIdAndUpdate(postId,post,{new:true,runValidators:true});
    resp.json({
        status:"success",
        message:"Post successfully updated",
        updatePost,
    })
})
//@desc Like a post
//@route PUT/api/v1/posts/like/:postId
//@ access private

exports.likePost = asyncHandler(async(req,resp, next) =>{
    //Get the id of the post
    const{postId} = req.params
    // Get the current user 
    const currentUserId = req.userAuth._id;
    // search the post
    const post = await Post.findById(postId)
    if(!post){
        let error = new Error("Post not found")
        next(error)
        return;
    }
    // Add the currentUserId to likes array
    const updatedPost = await Post.findByIdAndUpdate(postId,{$addToSet:{likes:currentUserId}},{new:true})
    // remove the current userId from dislikes array
    post.dislike = await post.dislike.filter(
        (userId) => userId.toString() !== currentUserId.toString()
    )
    // resave the post
    await post.save();
    resp.json({
        status:"success",
        message:"Post liked sucessfully",
        
    })
}
) 
//@desc Dislike A post
//@route PUT/ api/v1/posts/like/:postId
//@access private

exports.dislikePost = asyncHandler(async(req,resp,next) =>{
    // get the id of the post
    const {postId} = req.params;
    // get the current user
    const currentUserId = req.userAuth._id
    // search the post
    const post = await Post.findById(postId)
    if(!post){
        let error = new Error("Post not Found")
        next(error);
        return;
    }
    // add the currentUserId to dislike array
    await Post.findByIdAndUpdate(
        postId,
        {$addToSet:{dislike:currentUserId}},
        {new :true}
    );
    //Remove the currentUserId from likes array
    post.likes = post.likes.filter(
        (userId) =>userId.toString() !== currentUserId.toString()
    )
    // resave the post
    await post.save();
    // send the response
    resp.json({
        status:"success",
        message:"Post disliked successfully",
    })
})

//@desc clap a post
//@route PUT/ api/v1/posts/claps/:postId
//@access private
exports.clapPost = asyncHandler(async(req,resp,next) =>{
    // Get the id of the post
    const {postId} = req.params;
    //Search the post
    const post = await Post.findById(postId)
    if(!post){
        let error = new Error("Post not found")
        next(error)
        return;
    }
    //implemnts claps
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            $inc:{claps:1}
        },
        {new :true}
    )
    resp.json({
        status:"success",
        message:"Post clapped successfully",
        updatedPost
    })
})
//@desc Schedule A Post
//@route PUT /api/v1/posts/schedule/:postId
//@access private

exports.schedulePost = asyncHandler(async(req,resp,next) =>{
    // Get the data
    const {postId} = req.params;
    const{scheduledPublish} = req.body;
    //Check if postId and scheduledPublish are present
    if(!postId || !scheduledPublish){
        let error = new Error("PostId and Schedule Date are required")
        next(error)
        return;
    }
    //find the post from the database
    const post = await Post.findById(postId)
    if(!post){
        let error = new Error("Post not found")
        next(error)
        return;
    }
//check if the currentUser is the author
if(post.author.toString() !== req.userAuth._id.toString())// post.author say humay us user ki id milegi jis user nay isay create kiya hoga
{
    let error = new Error("you can schedule only your post")
    next(error);
    return;
}
const scheduleDate = new Date(scheduledPublish);// this will convert string date into date format 
const currentDate = new Date()
if(scheduleDate < currentDate){
    let error = new Error("Schedule date cannot be previous date");
    next(error);
    return;
}
post.scheduledPublished = scheduleDate;
await post.save();
//send the response
resp.json({
    status:"success",
    message:"Post schedule successfully",
    post,
});


})