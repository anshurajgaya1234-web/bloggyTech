const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
//! load dotenv into process object
dotenv.config();
const sendEmail = async ( // mail bhejna ek time consuming process hoga,2 arugument ek vo mail jismay emailid jayegi aur dusra reset token chaiye 
  to, resetToken  
)=>{
    try{// phala kam jo apko mail bhejnay kay liye karnaa hai vo apko transport ka object banana hai
        //node mailer tranport ko use karta hai apkay mail server kay configration kay liye 
        // jab apka node mailer ko bolay gay mujhe mail send karna hai, toh nodemailer ko ye batana padega ki mail server kon sa hai
        // hamara mail server gmail hai toh hum gmail ko use karegay
        //hulog nodemailer may traansport type ka object create karwa kay,node mailer ko mail server ki detail pass karegay using creatTransport() 
        //! create a transport object
        const transport = nodemailer.createTransport({// passs an object jismay app setup kaogay mailserver
            host:"smtp.gmail.com",// q ki apka mail server gmail hai isliye gmailserver
            port:587,// jab gmail server use karna hai portnumber dana hai 587
            secure:false,// gmail ka server apko option deta hai jo app connection stablish karegay vo ssl hoga ya non ssl hoga(http or https hoga), nodemailer non ssl connection stablish karta hai baad may usko ssl may convert kar deta hai
            auth:{// auth ek obj hai jo 2 cheez layta hai 
                  user:process.env.GMAIL_USER,      //1. vo mail id jis say mail jayegi
                  pass:process.env.APP_PWD     //2.
            }
        });
        //!Create the message to be sent
        //maily pass karna hoga token, jis pay user click karega toh vo vapas redirect ho jayega apki websit pay
     
        const message = {
            to ,  // mail kisko jani hai(ye uppar waala hi to as we know key value same toh aisay hi key rakh detay hai)
           
           subject :"Password Reset Token",// q bhej rahe region
            html: `<p>  You are receiving this email because you (or someone else) have requested the reset of a password.</p>
            <p>please click on the following link, or paste this into your browser to complete the process:</p> 
            <p> https://localhost:3000/reset-password/${resetToken}</p>
            <p> if you did not request this, please ignore this email </p>`
            //html q kar rahe q ki hum chatay hai hum jo bhi text bhejay vo html style may jaye, html style me isliye jaye q ki usmay jo token hoga uspay click karnay par apan logo ko request generate karni hai, aur phir click karnay par user redirect ho jaye hamaray web site pay
        
        };
        //!send the mail
      
        //toh send email kay liye transport object kay ek method hota hai jiska nam hota hai send mail
       const info = await transport.sendMail(message)// promise resolve hua toh ye return karega id (messaage id)
        console.log("Email sent ",info.messageId)
    }catch(error){
        console.log(error)
        return;
        throw new Error("Email sending failed!")
    }
};
module.exports = sendEmail;