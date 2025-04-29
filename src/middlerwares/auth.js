const User=require("../models/user")
const jwt=require('jsonwebtoken')
const adminAuth=(req,res,next)=>{

    const token="xyz"
    
    if(token !=='xyz'){
       res.send("it is not authorize" )
    }
   else{
    next()
   }
}

const userAuth=async(req,res,next)=>{
 try {
    const {token} =req.cookies;
    if(!token){
        throw new Error("Token is not there")
      }
      var decode =jwt.verify(token,"devTinder@123");
      const user=await User.findById(decode?._id);
      if(!user){
        throw new Error("No user founded")
      }
      req.user=user;
   next();
 } catch (error) {
    console.error("Error " + error.message);
    res.status(401).send("Error "  + error.message)
 }
 
}


module.exports={
    adminAuth,userAuth
}