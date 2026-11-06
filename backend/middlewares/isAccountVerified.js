const User = require("../models/Users/User")
const isAccountVerified = async (req,resp,next)=>{
    try{
        //find the user
        const currentUser = await User.findById(req.userAuth._id)
    //
if(currentUser.isVerified){
    next();

}else{
    resp.status(401).json({message:"Account not verified"})
}
    }catch(error){
        resp.status(500).json({
            message:"server error",error
        })
    }
};
module.exports = isAccountVerified