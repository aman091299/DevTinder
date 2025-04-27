const mongoose=require('mongoose')

const connectDb=async()=>{
    
await mongoose.connect('mongodb+srv://aman091299:MWwEkOcrnfo7CboX@cluster0.jddeahl.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0')

}



module.exports=connectDb;
