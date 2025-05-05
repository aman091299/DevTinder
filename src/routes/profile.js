const express=require('express');
const User=require('../models/user')
const {userAuth}=require('../middlerwares/auth')
const profileRouter=express.Router();
const validator=require('validator');
const validate=require('../utils/validate')
const bcrypt=require('bcrypt');

profileRouter.get('/profile/view',userAuth,async(req,res)=>{
   const user= req.user;

    try {
        const userInfo= await User.findById(user._id);
        res.status(200).json({
          message:"Profile of " + userInfo.firstName +" " +userInfo.lastName,
          data:userInfo
        })
      
    } catch (error) {
        res.status(400).json({success: false,
            message:"Error in viewing Profile " + error
        })
    }
})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
   const loggedUserInfo=req.user;
   const userInfo=req.body;
 
   try {
    const {emailId,password}=req.body;
    if(emailId){
        return  res.status(201).json({message:"Email id cannot be updated"});

    }
    if(password){
        return  res.status(201).json({message:"Password cannot be updated"});
}

    validate(req);

    const user=await User.findByIdAndUpdate(loggedUserInfo._id,userInfo,{returnDocument:'after'});

    res.status(200).json({
        message:user.firstName + user.lastName + " profile is updated sucessfully",
        data:user
    })
    
   } catch (error) {
    res.status(400).json({
        success: false,
        message:"Error while updating profile " + error
    })
   }

   
})

profileRouter.patch('/profile/password',userAuth,async(req,res)=>{
  try {

    const userInfo=req.user;

   const {newPassword,confirmNewPassword}=req.body;

   if(!newPassword || !confirmNewPassword){
    return  res.status(201).json({success: false,message:" New Password and Confirm New Password required"});

   }
   if(await userInfo.validatePassword(newPassword)){
   
     return  res.status(201).json({success: false,message:" You used this password recently. Please choose a different one."});

   }
    if(!validator.isStrongPassword(newPassword)){

        return  res.status(201).json({success: false,message:"Password is not strong enough. It must contain at least 8 characters, a symbol, a number, and both uppercase and lowercase letters."});

    }
    if(newPassword !== confirmNewPassword){
        return  res.status(201).json({success: false,message:"Password does not match"});

    }

    const hashPassword=await bcrypt.hash(newPassword,10);
    await User.findByIdAndUpdate(userInfo._id,{password:hashPassword});
    res.status(200).json({
        message:"Password update sucessfully"
    })
  } catch (error) {
    res.status(400).json({
        success: false,
        message:"Error in update user password " + error.message
    })
  }
})

module.exports=profileRouter;