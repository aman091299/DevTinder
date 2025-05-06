const Chat = require('../models/chat');
const {userAuth}=require('../middlerwares/auth')
const express=require('express');
const chatRouter=express.Router();

chatRouter.get('/chat/:targetUserId',userAuth,async(req , res)=>{
        
    try { 
        const userId=req.user._id;
        const {targetUserId}=req.params;
        const chat=await Chat.findOne({participantes:{$all:[userId , targetUserId]}}).populate({path:"messages.senderId",select:'firstName lastName photoUrl'});
          if(!chat){
           return res.status(201).json({data:chat,
                message:"No  chat exit between two user"
            })
          }
        res.status(200).json({data:chat,
            message:"Got the chat between two user"
        })
    } catch (error) {
         res.status(500).json({
            message:"Error while getting chat data"+error
         })
    }
     
})

module.exports=chatRouter;