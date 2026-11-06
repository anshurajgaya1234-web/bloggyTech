const express = require("express")// this will give a function
const dotenv = require("dotenv")
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");
const { notFound, globalErrorHandler } = require("./middlewares/globalErrorHandler");
const categoriesRouter = require("./routes/categories/categoriesRouter");
const postsRouter = require("./routes/posts/postsRouter");
const commentsRouter = require("./routes/comments/commentsRouter");
const sendEmail = require("./utils/sendEmail");
//!create an exprese app
const app = express() // then jab hum function ko call karegay toh humay milega ek obj 
//! load the env file or environmet variable 
dotenv.config();// ye likhne say jo bhi data app nay .env file may likha hai vo sab aa kay baith jayge gi process obj may
//? Establish connection to mongoDB
connectDB();
//sendEmail("anshurajgaya1234@gmail.com","Hello Welcome123")
//! set up the middlewaare
app.use(express.json())//!Ye client se aane wale JSON data ko parse karke req.body me daal deta hai.
// Enable CORS for all incoming client requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
//Parsing means converting raw incoming data into a structured format that the application can process.
//“express.json() converts JSON string into JavaScript object and stores it in req.body.”
//? setup the Router
app.use("/api/v1/users", usersRouter);

//? setup the Category Router
app.use("/api/v1/categories", categoriesRouter)
//? not found errror handler (ye route tab chalega jab koi route nahi chalega)

//? setup the post Router
app.use("/api/v1/posts",postsRouter)

//?Setup the Comment Router
app.use("/api/v1/comments",commentsRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "BloggyTech Backend is running"
    });
});

app.use(notFound)// this is guranteed ki agar ye wala middleware nahi chal raha hai  toh error aya hoga
//?setup the global error handlery
app.use(globalErrorHandler)// jab hum asynchandler may code daltay hai toh usmay error atay hi chala jayega global exception handler kay pass
const PORT = process.env.PORT||9080
app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`)
})
// port number of mongodb is 27017 
// jab humay mongodb say locally connection banana hota hai tab hum use kartauy hai mongodb://localhost:27017
// api client  ka data capture kartay hai node may body say req.body say
// node mailer npm package jo node application may apko, mail bhejna bahut hi simple tarikay say provide karwati hai
