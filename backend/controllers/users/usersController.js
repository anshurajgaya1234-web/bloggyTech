const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
//@ register new user
// @routee POst api/v1/users/register
//@ access public
const User = require("../../models/Users/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto")
const { response } = require("express");
const sendEmail = require("../../utils/sendEmail");
const sendAccountVerificationEmail = require("../../utils/sendAccountVerificationEmail");
exports.register = asyncHandler(
    async (req, resp,next) =>{
   
        const { username ,password,email} = req.body;
     const user = await User.findOne({username}) // user is model at here, awit is liye q ki return hoga promise
     if(user)
        throw new Error("User already existing");
    const newUser = new User({username, email,password})
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password,salt)
         await newUser.save();
         resp.json({
            status:"success",
            message:"User registered successfully",
            _id:newUser?.id,
            username:newUser?.username,
            email:newUser?.email,
            role:newUser?.role,
         })
}
)

//@desc Login new user
// @route POST/api/v1/users/login
//@ access public
exports.login = asyncHandler(
    async (req,resp, next) =>{
  
const {username, password} = req.body
const user = await User.findOne({username})// find one ko agar data mil gaya toh apkko vo apka data return  kar kaydega
if(!user){// agar user naa milay toh
throw new Error("Invalid credentials")
}
let isMatched = await bcrypt.compare(password,user?.password)// phala password vo password hoga jo user nay pass kara hai, 2nd db wala
    if(!isMatched){
        throw new Error("Invalid credentials")
    }
    user.lastlogin = new Date();
    await user.save();// save update aur save donno karta hai
    resp.json({status:"success",
        email:user?.email,
        _id:user?._id,
        username:user?.username,
        role:user?.role,
        token:generateToken(user)});
  
}
)

//@desc profile view
//@route get api/v1/users/profile/:id
//@access private
exports.getprofile = asyncHandler(
    async (req, resp, next) =>{
    console.log("Rec:", req.userAuth)

    
        const user = await User.findById(req.userAuth.id).populate({
            path:"posts",
            model:"Post"// posts kis model say connected hai i.e Post
        }).populate({path:"following",model:"User"})
        .populate({path:"followers",model:"User"})
          .populate({path:"blockedUsers",model:"User"})
        .populate({path:"profileViewers",model:"User"});
        resp.json({status:"success",
            message:"profile fetched",
          user,// js may key aur value same then ek hi value say kam chal jayega
        })
    
}
)
//@desc Block User
//@route PUT api/v1/users/blocke/userIdToBlock (jab bhi server pay resource chage hota hai api call put ka diya jata hai)
//@ access private 
exports.blockUser = asyncHandler(async (req,resp,next) =>{
    //!find the userid to be blocked
    const userIdToBlock = req.params.userIdToBlock;
    //! check whether the user is present in db or not
    const userToBlock = await User.findById(userIdToBlock)
    if(!userToBlock){// this means user is not in database
        let error = new Error("User to block not found")
        next(error);
        return;
    }
    //! Get the the current user id
    const userBlocking = req?.userAuth?._id
    //! check if it is self blocking
    if(userIdToBlock.toString() === userBlocking.toString()){// ye dono id hai aur id huray project may hai object
        // jab hum javascript may do object compare kartay hai toh javascript compare kar deti hai address(aur dono ka address diffrent hoga toh dono ki matching hamesha false ayegi)
        // library name low dash can compar two object
        // nahi toh hum userIdToBlock === userBlocking inko tostring may karkay compare kar saktay hai
        let error = new Error("Cannot block yourself!")
        next(error);
        return;
    }
    //!Get the Current user object from database
    const currentUser = await User.findById(userBlocking);
    //! check whether the userIdToBlock is alredy blocked
    // user model may blockeduser nam ki ek entry hai aur humay is entry may dekhni hai khya user already blocked hai
    if(currentUser.blockedUsers.includes(userIdToBlock)){//currentUser may jaa rahe hai uskay pass array hai blockedUser nam ka aur array kay pass ek method hai includes so ye dunday ga khya user phalay say hi blocked hai khya 
        let error = new Error("This user is already blocked!")
        next(error)
        return;
    }
    //! push the user to be blocked in the blockedUsers array
    currentUser.blockedUsers.push(userToBlock);// this will not going to save data in db so
    await currentUser.save();
    resp.json({
        status:"success",
        message:"user blocked successfully",
    })
})
//@desc UnBlock user
//@route PUT/api/v1/users/block/userIdToBlock (unblock karegay toh array may say data delete hoga aur iska mtlb server par resource update ho raha hai,so agar update ho raha hai toh is kam ko karnay kay liye use karegay put)
//@access private
exports.unblockUser = asyncHandler(async(req,resp,next) =>{
    // find the user to be unblocked
    const userIdToUnBlock = req.params.userIdToUnBlock;
    const userToUnBlock = await User.findById(userIdToUnBlock);//agar id match then we will get document object ,nahi match honay pay we will get null
    if(!userToUnBlock){
        let error = new Error("User to unblock not found!");
        next(error)
        return;
    }
    //find the current user
    const userUnBlocking = req?.userAuth?._id;
    const currentUser = await User.findById(userUnBlocking);

    //check if the user to unblock is already blocked
    if(!currentUser.blockedUsers.includes(userIdToUnBlock)){
        let error = new Error("User not blocked");
        next(error)
        return;
    }
    // remove thr user from current user blockedUsers array
  currentUser.blockedUsers = currentUser.blockedUsers.filter((id)=>{
        return id.toString() !== userIdToUnBlock;
    })//id here is object so convert it into string
    // update the Db
    await currentUser.save();

    // return the response
    resp.json({
        status:"success",
        message:"User Unblocked successfully"
    })
})
//@desc view another user profile
//@route GET/api/v1/users/view-another-profile/:userProfileId(get isliye q ki bs hum ek hi bar chage kargegay array may jab user phali bar profile dekhay ga tab nahi toh hum put bhi rakh saktay hai)
//@access private 
exports.viewOtherPofile = asyncHandler(async(req,resp,next) =>{
    //Get the userId whose profile to be viewed
    const userProfileId = req.params.userProfileId;
    const userProfile = await User.findById(userProfileId);
    if(!userProfile){
        let error = new Error("User whose profile is to be viewed not present!")
        next(error);
        return;
    }
    const currentUserId = req?.userAuth?._id;
    //check it we have already viewed the profile of userProfileId
    if(userProfile.profileViewers.includes(currentUserId)){
        let error = new Error("User already viewed the profile ")
        next(error)
        return;
    }
    // push the currentUserID into array of userProfile
    userProfile.profileViewers.push(currentUserId);
    //update the db
    await userProfile.save();
    // return the response
    resp.json({
        status:"success",
        message:"Profile successfully viewed"
    });
})
//@desc Follow User
//@route Put /api/v1/users/following/:userIdToFollow(put isliye q ki app dono user kay andar entry change karegay)
//@access private
exports.followingUser = asyncHandler(async(req,resp,next) =>{
    //find the current user id
    let currentUserId = req?.userAuth?._id;
    // find the user to be followed
    const userIdToFollow = req.params.userIdToFollow;
    const userProfile = await User.findById(userIdToFollow)
    if(!userProfile){
        let error = new Error("User whose profile have to viewed not present")
        next(error)
        return;
    }
    //! hw
    //Avoid current user Following himself
    if(currentUserId.toString() === userIdToFollow.toString()){
        let error = new Error("You canot follow yourself")
        next(error)
        return;
    }
//following,followers
    //Push the id usertoFollow inside following array of current user

    //$push karnay pay agar id array may phalay say hue toh bhi phir say push ho jayegi,lakin tum $addToSet karoge tabhi array may add karega jab ye phalay say na ho
   //$addtoset mongoose ka operator hai jo is bat ki sureity layta hai ki ye array may data tab hi add karega jab data array may phalay say available na ho
   // to do changes in db we use findByIdAndUpdate
   await User.findByIdAndUpdate(currentUserId,{
        // ye line data save bhi ho gaya, aur include bhi nahi karna pada
        $addToSet:{following:userIdToFollow}
        },
        {new:true});

    //push the current user id into the followers array of userToFollow
    await User.findByIdAndUpdate(userIdToFollow,
        {$addToSet:{followers:currentUserId}},
    {new:true}
    );

    //send the response
    resp.json({
        status:"success",
        message:"you have followed the user successfully",
    })
   
})
//@desc UnFollow User
//@route Put /api/v1/users/unfollowing/:userIdToUnFollow
//@access private

exports.unFollowingUser = asyncHandler(async (req,resp,next) =>{
    // find the current user id
    const currentUserId = req?.userAuth?._id;

    //find the user to be followed

    const userIdToUnFollow = req.params.userIdToUnFollow;
   
     // you cannot unfollow yourself
    //Avoid current user following himself
    if(currentUserId.toString() === userIdToUnFollow.toString()){
        let error = new Error("you cannot follow yourself!");
        next(error)
        return;
    }
   //check whether the user exists
     const userProfile = await User.findById(userIdToUnFollow);
     if(!userProfile){
        let error = new Error("User to be unfollowed not present")
        next(error)
        return;
     }
     // Get the current user object
     const currentUser = await User.findById(currentUserId)

     // check whether the current user has followed userIdToUnfollow or not
     if(!currentUser.following.includes(userIdToUnFollow)){
        let error = new Error("you cannot unfollow the user you did not folloe!")
    next(error)
    return;
     }
     // remove the userIdToUnfilloe from the followeing array
     // push is used for adding a data in a array vaisay hi pull hota hai for deleting a data from an array
     await User.findByIdAndUpdate(currentUserId,
        {$pull:{following:userIdToUnFollow}},
        {new:true})
     
     // {$pull:{following:userIdToUnFollow} this line of code is saying is that ki data delete karo vo bhi following may say jiska ki id kuch diya gaya hai and then new:true is saying ki isko return kardo
        // remove the currentUserId from the followers array to userToUnFollow
        await User.findByIdAndUpdate(
            userIdToUnFollow,
            {
                $pull:{followers:currentUserId},
            },
            {new :true}
        );
        //send the response
        resp.json({
            status:"success",
            message:"you have unfollowed the user successfully",
        })
    })
//@desc Forgot password
//@route Post/api/v1/users/forgot-password
//@access public
exports.forgotPassword = asyncHandler(async(req,resp,next) =>{
    //!fetch the email
    const {email} = req.body;
    //!find email in the Db
    const userFound = await User.findOne({email});
    if(!userFound){
        let error = new Error("this email id is not registered with us")
        next(error);
        return;
    }
    //! Get the reset token
    const resetToken = await userFound.generatePasswordResetToken()// ye user object ka method hai ismay apnay app promise attach ho gaya hoga
    //! save the changes(resetToken and expiryTime) to the DB

    await userFound.save();
    sendEmail(email,resetToken)
    resp.json({
        status:"success",
        message:"password reset token sent to your email sucessfully",
    })
})
//@desc Reset password
//@route Post/api/v1/users/reset-password/:resetToken
//@access public
exports.resetPassword = asyncHandler(async (req,resp,next)=>{
    //Get the token from param
    const {resetToken} = req.params;
    // Get the password
    const {password} = req.body

    //Convert resetToken into hashed token
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    //verify the token with db
    const userFound = await User.findOne({
        passWordResetToken:hashedToken,
        passwordResetExpires:{$gt:Date.now()}
    })

    if(!userFound){
       
    let error = new Error("password reset token is invalid or expired")
    next(error);
    return;
}
// Update the new password
const salt = await bcrypt.genSalt(10);
userFound.password = await bcrypt.hash(password,salt);
userFound.passWordResetToken = undefined;
userFound.passwordResetExpires = undefined;
//Resave the user
await userFound.save();

//send the response
resp.json({
    status:"sucess",
    message:"password has been chaged succesfully"
})
});
//@desc Send Account Verification Mail
//@route POST/API/V1/users/account-verification-email
//@access private 
exports.accountVerificationEmail = asyncHandler(async(req,resp,next) =>{
    //find the current users email
    const currentUser = await User.findById(req?.userAuth?._id);
    if(!currentUser){
        let error = new Error("user not found!")
        next(error);
        return;
    }
    //Get the token from current user object
    const verifyToken = await currentUser.generateAccountVerificationToken();
    //resave the user
    await currentUser.save();
    //send the verification email
    sendAccountVerificationEmail(currentUser.email,verifyToken)
    resp.json({
        status:"success",
        message:`Account verification email has been sent to your registered email id ${currentUser.email}`
    })
})

//@ Account Token Verification 
//@route PUT/api/v1/users/verify-account/:verifyToken
//@access private
exports.verifyAccount = asyncHandler(async (req,resp,next) =>{
    //Get the token from params
    const { verifyToken} = req.params;

    //Convert the token into hashed form
    let cryptoToken = crypto.createHash("sha256")
    .update(verifyToken)
    .digest("hex")

    const userFound = await User.findOne({
        accountVerificationToken:cryptoToken,
        accountVerificationExpires:{$gt:Date.now()},
    });
    if(!userFound){
        let error = new Error("Account token invalid or expired")
        next(error)
        return;
    }
    userFound.isVerified = true;
    userFound.accountVerificationExpires = undefined;
    userFound.accountVerificationExpires = undefined;
    // resave the user
    await userFound.save();
    resp.json({
        status:"sucess",
        message:`Account sucessfully verified`
    })
})