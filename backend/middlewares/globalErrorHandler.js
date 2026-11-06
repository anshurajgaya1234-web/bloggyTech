const globalErrorHandler = (error,req,resp,next) =>{
    const status = error?.status? error.status:"failed";// agar error obj may status property hue toh yaha pay ek string ayegi otherwise failed jayega
   const message = error?.message;
   const stack = error?.stack;// error kay pass property hoti hai stack
    resp.status(500).json({status,message,stack})// agar app chatau hai ki apka ye middle ware chalee toh her catch may dal digiye next may error taki ye wala middleware chale
}
const notFound = (req,resq,next) =>{
  let error = new Error(`cannot find the the route for ${req.originalUrl} at the server`);
  next(error);
}
module.exports ={globalErrorHandler,notFound}