
const express=require('express')
const connectionRouter=express.Router();
const {  userAuth } = require("../middlerwares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require('../models/user')
const mongoose=require('mongoose')

//here status can be interested or ignored
connectionRouter.post('/request/send/:status/:userId',userAuth,async (req,res)=>{

    //a user can send interest request to other user or other user can send interest request to that user
  
    try{
        const {userId,status}=req.params;
        const fromUserId=req.user;
        const ALLOWED_VALUES=['interested','ignored'];
         if(!ALLOWED_VALUES.includes(status)){
            throw new Error("This status value is not allowed");
         }
  
         // Validate userId format
     if (!mongoose.Types.ObjectId.isValid(userId)) {
              throw new Error("Invalid userId format");
         }
         const  checkUserExist=await User.findById(userId);

         if(!checkUserExist){
            throw new Error("User does not exit in DB")
         }
        const connectionRequestAlreadyExist=await ConnectionRequest.findOne({$or:
            [{fromUserId:fromUserId._id,toUserId:userId},{fromUserId:userId,toUserId:fromUserId._id}]
        })
    

        if(connectionRequestAlreadyExist){
            throw new Error ("Connection already exist");
        }
        
         const connectionRequestInfo=new ConnectionRequest({
            toUserId:userId,status,fromUserId:fromUserId._id
         })
       
         await  connectionRequestInfo.save();
           
        res.status(200).send({
            message:'connection establish sucessfully',
            data:connectionRequestInfo
        });
    }
    catch(error){
        res.status(400).send("Error in connection establishing " + error.message);
    }
  
  })

//here status can be accepted or rejected
//it will happen after having interested status
connectionRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{

    try{
        
    const loggedInUser=req.user;

    const {status,requestId}=req.params;

    const ALLOWED_FEILD=['accepted','rejected'];
    if(!ALLOWED_FEILD.includes(status)){
             throw new Error("Invalid status, status can only be accepted or ignored")
    }
          // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
            throw new Error("Invalid userId format");
       }


     const isConnectionRequestExist=await ConnectionRequest.findOne({
       _id :requestId,
       status:'interested',
        toUserId:loggedInUser._id
     }).populate('fromUserId',"firstName lastName")
     .populate('toUserId',['firstName','lastName'])

     if(!isConnectionRequestExist){
        throw new Error("connection  request interested does not exist")
     }
     isConnectionRequestExist.status=status;
     await isConnectionRequestExist.save();

    res.status(200).json({
        message:"request is " + status,
        data:isConnectionRequestExist
    })
    }
    catch(error){
        res.status(400).json({
            message:"Error in accepting or rejecting request" + error
        })
    }

})

  module.exports=connectionRouter;
 