const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const authRouter = express.Router();
const SignUpValidation=require('../utils/signUpValidation')

authRouter.post("/signup", async (req, res) => {
  const { emailId,password } = req.body;
  const userInfo = req.body;
  try {
    SignUpValidation(req,res);
    
    const userEmail = await User.findOne({ emailId: emailId });
    if (!userEmail) {
     return res.status(201).json({message:"User Already exist please login",  success: false});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    userInfo.password = hashPassword;
    //creating a new instance of User model
    const user = new User(userInfo);
    await user.save();

    const token = await user.getJwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      secure: true,
      sameSite: "None",
      httpOnly: true,
    });

   return res
      .status(200)
      .json({
        message: "User registered successfully ",
        data: user,
        success: true,
      });
  } catch (error) {
    console.error("User insertion fail ", error);
    res
      .status(500)
      .json({ message: "User inserting fail " + error, success: false });
  }
});

authRouter.post("/login", async (req, res) => {
  const USER_VALUES =
    "firstName emailId lastName _id gender dob about skills photoUrl createdAt updatedAt";
  const { emailId, password } = req.body;

  try {
    if (!emailId) {
     return  res.status(201).json({success: false,message:"Emailid is required"})
    }
    if (!password) {
     return res.status(201).json({success: false,message:"Password is required"});
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
     return res.status(201).json({message:"Invalid Credential",  success: false});
    }
    const isMatchPassword = await user.validatePassword(password);
    if (!isMatchPassword) {
     return res.status(201).json({  success: false,
      message:"Invalid Credential"});
    }

    const { password: pwd, ...userWithoutPassword } = user._doc;

    const token = await user.getJwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      secure: true,
      sameSite: "None",
      httpOnly: true, 
     
    });
   return res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("User authetication failed " + error);
    res.status(400).json({
      success: false,
      message: "User authetication failed " + error,
    });
  }
});
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    secure: true,
    sameSite: "None",
    httpOnly: true,

  });
return  res.status(200).json({
  success: true,
    message: "User logout sucessfully",
  });
});

module.exports = authRouter;
