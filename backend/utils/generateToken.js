const jwt = require("jsonwebtoken");// this will return an object
const generateToken =(user) =>{
    const payload = {
        user:{
            id:user._id,
        },
    };
    const token = jwt.sign(payload,process.env.JWT_KEY,{expiresIn:36000})
    return token;
}
module.exports = generateToken;