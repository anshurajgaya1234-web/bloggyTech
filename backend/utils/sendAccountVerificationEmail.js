// why we had creted this just because send email ka msg same nahi hona hai idhar
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

//!load dotenv into process object
dotenv.config()
const sendAccountVerificationEmail = async(to,verificationToken)=>{
try{
    const transport = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.GMAIL_USER,
            pass:process.env.APP_PWD
        },
    });
    const message = {
        to,
        subject:"Account verification token",
          html: `<p>  You are receiving this email because you (or someone else) have requested to verify your account.</p>
            <p>please click on the following link, or paste this into your browser to complete the process:</p> 
            <p> https://localhost:3000/reset-password/${verificationToken}</p>
            <p> if you did not request this, please ignore this email </p>`
    }
    //!send the email
    const info = await transport.sendMail(message);
    console.log("Email sent",info.messageId);

}catch(error){
    console.log(error);
    throw new Error("Email sending failed")
}
}
module.exports = sendAccountVerificationEmail;