const express=require('express');
const {userAuth}=require('../middlerwares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User=require('../models/user')
const userRouter=express.Router();


userRouter.get('/user/requests/recieved',userAuth,async(req,res)=>{

    try {
        const isLoggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            $or:[
            {toUserId:isLoggedInUser._id },
         { fromUserId:isLoggedInUser._id }
        ],
        status:'interested'})
        .populate('toUserId', 'firstName lastName')
        .populate('fromUserId', 'firstName lastName');

        res.status(200).json({
            data:connectionRequest
        })
    } catch (error) {
        res.status(400).json({
            message:"Error" +error.message
        })
    }

})


userRouter.get("/user/connections",userAuth,async(req,res)=>{
  

    try {
             const isLoggedInUser=req.user;
           const connections=await ConnectionRequest.find({
            $or:[{ toUserId:isLoggedInUser._id},{fromUserId:isLoggedInUser._id}],status:'accepted' 
        }).populate('toUserId', 'firstName  lastName')
        .populate('fromUserId', 'firstName  lastName')
     

        res.status(200).json({
            message:'connection who request are accepted',
            data:connections
        })
    } catch (error) {
        res.status(400).json({
            message:"Error  in connection accepted requests" + error.message
        })
    }

})


userRouter.get("/feed",userAuth,async(req,res)=>{
    const USER_VALUES="firstName lastName _id gender dob about skills photoUrl createdAt updatedAt"
    const page=parseInt(req.query.page) || 1;
    let limit=parseInt(req.query.limit) || 10;
    limit=limit > 50 ? 50 : limit;
    const skip=(page-1)*limit;


    try {
        const  loggedInUser=req.user;
        const connections=await ConnectionRequest.find({$or:[
            {toUserId:loggedInUser._id},
            {fromUserId:loggedInUser._id}
        ]});
        const excludeUserIds=new Set();

        connections.map(conn=> {excludeUserIds.add(conn.fromUserId.toString())
                    excludeUserIds.add(conn.toUserId.toString())}
                        );
       
        const user=await User.find({$and:[  {_id:{$nin:Array.from(excludeUserIds)}},
                     {_id :{$ne :loggedInUser._id}}
        ]
          
        }).select(USER_VALUES).skip(skip).limit(limit);
      res.status(200).json({
        data:user
      })
    } catch (error) {
        res.status(400).json({
            message:"Error in feed " + error.message
        })
    }
})
module.exports=userRouter;