
const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User',
    },
    text:
        {type:String,
            required:true,

        },
    
},{timestamps:true})

const chatSchema=new mongoose.Schema({
    participantes:[
        {type: 
            mongoose.Types.ObjectId,
             User:'ref',
             required:true,

        },
    ],
    messages:[messageSchema]
})

const Chat=mongoose.model('chat',chatSchema);

module.exports=Chat;