const jwt = require("jsonwebtoken")
const User = require("../models/Users/User")
const isLoggedIn = (req,resp,next) =>{
    console.log("isLoggedIn executed")
    // fetch token from request
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return resp.status(401).json({ status: "failed", message: "No token provided, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    console.log("token",token);
    
    // verify token
    jwt.verify(token,process.env.JWT_KEY,async (err,decoded) =>{
            //if unsuccesful then send the error message
       if(err){
       const error = new Error(err?.message) //jaisay hi  hum error object throw karegay control mighrate kar jayega global error handler kay pass
        //return resp.status(401).json({status:"Failed",message:err?.message})
        next(error);
       }else{
         // if succesful, then pass the user object to next path
         const userId = decoded?.user?.id;
         
       //  console.log("user",user);
      //profile object ko profile dikhana  hoga isliye isko bhejna padega user object
      // isay phalay hum next call kare humay nikalna hoga user object nikalna hoga database say
       const user = await User.findById(userId).select("username email role _id");// abhi ye user isliye nikala q ki ye abhi profile mauy bhejna lakin iska jarurat kafi jagahaa pay padega so  
      req.userAuth = user;// ye isliye kara hai ki  har jagaha pay user access ho paye
      next()// kisi bhi middleware may next likhnay say agla middlewwaare chal jata hai
       } 
    });
}
module.exports = isLoggedIn;
// ek middleware say dusray middlewaare ko data req object kay andar add karkay kartay hai
