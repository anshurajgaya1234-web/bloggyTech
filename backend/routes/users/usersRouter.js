const express = require("express")
const {register,login, getprofile,blockUser, unblockUser,viewOtherPofile,followingUser, unFollowingUser, forgotPassword, resetPassword, accountVerificationEmail, verifyAccount} = require("../../controllers/users/usersController")// register mau curly bracket isliye lag gaye q ki jab app require karegay toh pura object export ho jayega aur humay object kay andar ka function chaiye
const isLoggedIn = require("../../middlewares/isLoggedIn")
const usersRouter = express.Router()// this will give object
//!register Route
usersRouter.post("/register",register);
//!login Route
usersRouter.post("/login",login);
//!profile Route
//koi bhi middleware apkay route kay phalay chalana hai , jaha pay aap route ka get method call kar rahe hai vohi pay app call kar digiye apnay middlewaare ka nam 
usersRouter.get("/profile",isLoggedIn,getprofile);// aisay likhnay say phalay weala phalay chalega 

//! Blocked user Route
usersRouter.put("/block/:userIdToBlock",isLoggedIn,blockUser);

//!Unblock the User Route
usersRouter.put("/unblock/:userIdToUnBlock",isLoggedIn,unblockUser);

//!view another profile user Route
usersRouter.get("/view-other-profile/:userProfileId",isLoggedIn,viewOtherPofile)

//! Follow a user Route
usersRouter.put("/following/:userIdToFollow",isLoggedIn,followingUser);

//!UnFollow a user Route
usersRouter.put("/unfollowing/:userIdToUnFollow",isLoggedIn,unFollowingUser);

//!forgot password route
usersRouter.put("/forgot-password",forgotPassword);

//!reset password route
usersRouter.put("/reset-password/:resetToken",resetPassword)

//!send Account verification email route
usersRouter.put("/account-verification-email",isLoggedIn,accountVerificationEmail)

//!Account token verification route
usersRouter.put("/verify-account/:verifyToken",isLoggedIn,verifyAccount)
module.exports = usersRouter;
