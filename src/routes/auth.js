
const express = require('express');
const bcrypt=require('bcrypt')
const User = require("../models/user");
const validate=require('../utils/validate')

const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {

    const {password} = req.body;
    const userInfo=req.body;
    try {
      
      const hashPassword=await bcrypt.hash(password,10);
      userInfo.password=hashPassword;
      //creating a new instance of User model
      const user = new User(userInfo);
      await user.save();

      res.status(201).send("User registered successfully " + user);
    } catch (error) {
      console.error("User insertion fail ", error);
      res.status(500).send("User inserting fail " + error);
    }
  });

authRouter.post('/login',async(req,res)=>{
    const {emailId,password}=req.body;
   try {
    if(!emailId){
      throw new Error("Emailid is required")
    }
    if(!password){
      throw new Error("Password is required")
    }
    const user=await User.findOne({emailId:emailId});
    if(!user){
     throw new Error ("Invalid Credential");
    }
    const isMatchPassword=user.validatePassword(password);
    if(!isMatchPassword){
        throw new Error ("Invalid Credential");
    }
   const token= await user.getJwt();
  
    //setting the cookie to the browser having token
    res.cookie("token",token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true })
    res.status(200).send("Login sucessfully")
   } catch (error) {
    console.error('User authetication failed ' + error)
    res.status(500).send("User authetication failed " + error)
   }

  })

authRouter.get('/logout',(req,res)=>{
    res.cookie('token',null,{expires:new Date(Date.now())})
    res.status(200).json({
        message:"User logout sucessfully"
    })
})

  module.exports=authRouter;