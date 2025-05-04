const express=require('express');
const paymentRouter=express.Router();
const instance=require('../utils/rajorpay');
const {membership}=require('../utils/constant');
const { userAuth } = require('../middlerwares/auth');
const Payment=require('../models/payment');
var { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

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
              membership:type,
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
            })
           await createPayment.save();
           return res.status(200).json({
                message:'Order created succssfully',
                success:true,
                data:order,
                key:process.env.RAZORPAY_KEY_ID
            })
          });
    } catch (error) {
        res.status(500).json({success:false,messsage:'Error in order creating api' + error})
    }
})

paymentRouter.post('',async(req,res)=>{
    // validatePaymentVerification({"order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
const webhookBody=req.body;
const webhookSignature=req.headers['x-razorpay-signature'];

console.log("inside webhook body" + webhookBody +'webhook signature' + webhookSignature,process.env.WEBHOOK_SECREAT_KEY);
try{
    validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, process.env.WEBHOOK_SECREAT_KEY)
     res.status(200).json({message:"Webhook Signature Verify"})
}
catch(err){
    console.error("Webhook signature verification failed",err);
    res.status(400).json({message:'Invalid Signature'})
}
})

module.exports=paymentRouter;