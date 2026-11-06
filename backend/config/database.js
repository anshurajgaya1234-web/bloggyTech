const mongoose = require("mongoose")// to get connected with db first import mongooose
const connectDB = async () =>{// this function will connect to mongodb
    try{
   await mongoose.connect(process.env.MONGO_URL)
    console.log("connected succesfully to mongodb")
    }
    catch(error){
        console.log("connecion to mongodb is failed",error.message)
    }
};
module.exports = connectDB;
