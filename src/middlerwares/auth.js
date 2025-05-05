const User=require("../models/user")
const jwt=require('jsonwebtoken')


const userAuth=async(req,res,next)=>{
 try {
    const {token} =req.cookies;
    if(!token){
      return res.status(401).json({sucess:false,message:"Token is not there"})
      }
      var decode =jwt.verify(token,process.env.SECREAT_KEY);
      const user=await User.findById(decode?._id);
      if(!user){
        return res.status(401).json({sucess:false,message:"No user founded"})
      }
      req.user=user;
   next();
 } catch (error) {
    console.error("Error " + error.message);
    res.status(401).json({success:false,message:"Error "  + error.message})
 }
 
}


module.exports={
   userAuth
}