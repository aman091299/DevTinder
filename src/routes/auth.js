
const express = require('express');
const bcrypt=require('bcrypt')
const User = require("../models/user");
const validate=require('../utils/validate')
const validator=require('validator')
const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {

    const {password} = req.body;
    const userInfo=req.body;
    try {
     
        if(!validator.isStrongPassword(password,{
          
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          
        })){
       
     throw new Error("Password is not strong enough. It must contain at least 8 characters, a symbol, a number, and both uppercase and lowercase letters.");
        }
    
      
      const hashPassword=await bcrypt.hash(password,10);
      userInfo.password=hashPassword;
      //creating a new instance of User model
      const user = new User(userInfo);
      await user.save();

      const token= await user.getJwt();
   
      //setting the cookie to the browser having token
 //setting the cookie to the browser having token
  res.cookie("token",token, { 
  expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) ,
  https:true,
  path: "/",
  sameSite: "None", // Only use with HTTPS
  secure: true
    })     
     
      res.status(201).json({message:"User registered successfully " ,data:user,success:true});
    } catch (error) {
      console.error("User insertion fail ", error);
      res.status(500).json({message:"User inserting fail " + error,success:false});
    }
  });

authRouter.post('/login',async(req,res)=>{
     const USER_VALUES="firstName emailId lastName _id gender dob about skills photoUrl createdAt updatedAt"
    const {emailId,password}=req.body;
    
   
   try {
    if(!emailId){
      throw new Error("Emailid is required")
    }
    if(!password){
      throw new Error("Password is required")
    }
    const user=await User.findOne({emailId:emailId})
    if(!user){
     throw new Error ("Invalid Credential");
    }
    const isMatchPassword=await user.validatePassword(password);
    if(!isMatchPassword){
        throw new Error ("Invalid Credential");
    }
 
    const { password:pwd, ...userWithoutPassword } = user._doc;
 
   const token= await user.getJwt();
  
    //setting the cookie to the browser having token
    res.cookie("token",token, { 
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) ,
      https:true,
      path: "/",
      sameSite: "None", // Only use with HTTPS
      secure: true
    })
    res.status(200).json({
      success:true,
      data:userWithoutPassword
      
    })
   } catch (error) {
    console.error('User authetication failed ' + error)
    res.status(400).json({
      success:false,
      message:"User authetication failed " + error
    })
   }

  })
authRouter.post('/logout',(req,res)=>{
    res.clearCookie('token',{https:true})
    res.status(200).json({
        message:"User logout sucessfully"
    })
})

  module.exports=authRouter;