const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    status:{
        type:String,

        enum:{
            values:['interested','ignored','rejected','accepted'],
            message: '{VALUE} is not a valid status value'
        },
        required:[true,"Status is required"]

    }


})


connectionRequestSchema.pre('save',function(next){

 const toUserId= this.toUserId;
 const fromUserId=this.fromUserId;
 if(toUserId.equals(fromUserId)){
    throw new Error("You cannot establish a connection with yourself.");
 }
 next();

})
connectionRequestSchema.index({fromUserId:1 ,toUserId:1});
const ConnectionRequest=mongoose.model('ConnectionRequest',connectionRequestSchema);

module.exports=ConnectionRequest;