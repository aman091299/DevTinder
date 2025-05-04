const mongoose=require('mongoose');
const User=require('./user')

const paymentSchema=new mongoose.Schema({
    orderId:{
        type:String,
        required:true,
    },
    userId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User',
       required:true,

    },
    status:{
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true,
    },
    membership:{
        type:String,
    },
    isPremium:{
        type:Boolean,
        default:false,
        
    },currency:{
        type:String,
    }

},{timestamps:true});


const Payment=mongoose.model('Payment',paymentSchema);

module.exports=Payment;