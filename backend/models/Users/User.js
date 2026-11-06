const mongoose = require("mongoose") // this will returrn an obj
const crypto = require("crypto")// no need to import node builtin module
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum:["user","admin"],
        default: "user"
    },
    password:{
        type:String,
        required: true,
    },
    lastlogin:{
        type:Date,
        default : Date.now()
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    accountLevel:{// this will specify ki user khya khya kar payega
        type:String,
        enum:["bronze","silver","gold"],
        default:"bronze"
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverImage:{
        type:String,
        default:" "
    },
    bio:{
        type:String,
    },
    location:{
        type:String
    },
    notification:{
        email:{type:String, 
            //required: true
        },
    },
    gender:{
        type:String,
        enum:["male" ,"female","prefer not to say","non-binary"]
    },
    // other properties will deal with relationship(ek entity dusray entity say bat karta hai) for such relation mongoose give aspecial type of datatype that is objectid
    profileViewers:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    // profileViewer may anay wali property object hogi aur vo user type ka objecct hoga array ka symbol islie q ki profileViews der sare log hogay
    followers:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}],//
    // agar ek mongoose document ko dusray mongoose document say connect hona hai toh type may likhtay hai ObjectId and jis say connect hona ho usko batatay hai ref say
    following:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    blockedUsers:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}],
    posts:[{type: mongoose.Schema.Types.ObjectId, ref:"post"}],
    likedPosts:[{type: mongoose.Schema.Types.ObjectId, ref:"Post"}],
    passWordResetToken:{
        type:String,
    },
    passwordResetExpires:{
        type:Date,
    },
    accountVerificationToken:{
        type:String,

    },
    accountVerificationExpires:{
        type:Date,

    }

},
{
        timestamp:true,// ye line likhnay say humray document mau 2 line aur add ho jayega creaated at and updated at
   toJSON:{
    virtuals:true,
   },
   toObject:{
    virtuals:true,
   },
    })
userSchema.methods.generatePasswordResetToken = function(){//userSchema kay pass methods nam ki ek property hai,jo phalay say available hai vo maujud hai,isimay hum ek apna method introduce karnay jaa rahee hai,.methodname
//!generate token
const resetToken = crypto.randomBytes(20).toString("hex");//randomByte 20 character ka alpha numberic random byte buffer form may generate kar kay deta hai to usko string may convert karna padta hai
this.passWordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//above line says ji cypto kay pass createHash method hai jo humay ek hash object bana kar dega aur us hashobject kay pass ek update method hota hai ,ye puchega kiskay upar hashing karni hai,answer ayega resetToken ko hash karna hai, then isko hex may convert kar do jiskay liye method hota hai  digest and para meter may lay rahaa hai hex value and ultimately convert ho jayega hex value may
console.log("reset token",resetToken)
console.log("hashed token",this.passWordResetToken);
//!Set the expire  to 10 min
this.passwordResetExpires = Date.now() + 10*60*1000//current time milisecond may aa gaya
    return resetToken;
}

userSchema.methods.generateAccountVerificationToken = function(){
    //!genrate token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    this.accountVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    console.log("reset token",verificationToken)
    console.log("hashed token",this.accountVerificationToken)
    //! set the expiry time to 10 min
    this.accountVerificationExpires = Date.now() + 10*60*1000;
    return verificationToken
};
//! convert schema to model
const User = mongoose.model("User",userSchema); // 1st wala jis nam say humay schemaa bana hai vo nam mtlb model ka nam an ye ho gaya

module.exports = User;






