const instance=require('../utils/rajorpay');
const {membership}=require('../utils/constant');
const { userAuth } = require('../middlerwares/auth');
const Payment=require('../models/payment');
const User=require('../models/user');
var { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

const express=require('express');
const paymentRouter=express.Router();

paymentRouter.post('/payment/create/order',userAuth,async(req,res)=>{
    try {     
    const user=req.user
      const  {type}=req.body;
      const mem=membership[type]
      console.log(mem)
        var options = {
            amount: membership[type]*100,  
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
              firstName:user?.firstName,
              lastName:user?.lastName,
              user_id:user._id,
              membershipType:type,
            },
          };
       instance.orders.create(options, async function(err, order) {
            console.log(order);
            if(err){
               return res.status(400).json({
                    messages:'Error in creating order' + err,
                    success:false,
                })
            }
            const {id,amount,currency,notes,status}=order
            const createPayment=new Payment({
                orderId:id,
                amount:amount,
                currency:currency,
                status:status,
                userId:user._id,
                notes:{
                    firstName:notes.firstName,
                    lastName:notes.lastName,
                    membershipType:notes.membershipType,
                }
            })
           await createPayment.save();
           return res.status(200).json({
                message:'Order created succssfully',
                success:true,
                data:createPayment,
                key:process.env.RAZORPAY_KEY_ID
            })
          });
    } catch (error) {
        res.status(500).json({success:false,messsage:'Error in order creating api' + error})
    }
})

paymentRouter.post('/payment/webhook',async(req,res)=>{
    console.log("WEBHOOK Recieved");
    // validatePaymentVerification({"order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
const webhookBody=req.body;
const webhookSignature=req.headers['x-razorpay-signature'];

try{
 const isWebhookValid  = validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, process.env.WEBHOOK_SECREAT_KEY)
    
if(!isWebhookValid){
    console.log("WEBHOOK Invalid");
 return   res.status(400).json({message:'Invalid webhook Signature'})
}
     const {order_id, notes ,status}= webhookBody.payload.payment.entity;
     console.log("WEBHOOK orders details",order_id,notes,status);

     const payment=await Payment.findOneAndUpdate({orderId:order_id},{status:status},{new:true});
     if (!payment) {
        console.error("Payment not found for order:", order_id);
        return res.status(404).json({ message: 'Payment record not found' });
    }
     console.log("WEBHOOK Payment save",payment)

if (webhookBody.event ==='payment.captured'){
    payment.membershipType=notes.membershipType;

    const user=await User.findByIdAndUpdate(notes.user_id,{isPremium:true,membershipType:notes.membershipType},{new:true});
    if (!user) {
        console.error("user not found for user:", notes.user_id);
        return res.status(404).json({ message: 'user record not found' });
    }
    console.log("WEBHOOK payment captured 2",user);
    await payment.save();
     console.log("WEBHOOK payment captured 3",user,payment);
     console.error("Payment not found for order:", order_id);
  return   res.status(200).json({message:'Payment Verify Successfully'})
  
}
if(webhookBody.event==='payment.failed'){
    console.log("WEBHOOK payment fail");
   
    return res.status(200).json({message:'WEBHOOK payment fail'})
}
}
catch(err){
    console.log("WEBHOOK signature verification failed");
    console.error("Webhook signature verification failed",err);
    return res.status(400).json({message:'Invalid Signature'})
}
})

module.exports=paymentRouter;