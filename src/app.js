
const express=require('express');
const app=express();


app.use("/",(req,res)=>{
    res.send("hey");
})
app.use('/text',(req,res)=>{
res.send("text")
})

app.listen(7777,function(){
    console.log("Server is running in port 7777...")
})
