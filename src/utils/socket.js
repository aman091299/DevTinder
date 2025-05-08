
const socket=require('socket.io');
const crypto=require('crypto');
const Chat=require('../models/chat');
const { findOne } = require('../models/user');
const corsOptions = {
    origin: ['http://localhost:3000','https://dev-tinder-frontend-psi.vercel.app','https://devtinder-frontend-web.onrender.com'],
    credentials: true,
  };

 const getSecretRoomId=({userId,targetUserId}) =>{
  return crypto.createHash('sha256').update([userId ,targetUserId].sort().join('_')).digest('hex');
 }
const intilizedSocket = (server)=>{
        console.log("inside socket")
    const io=socket(server,{cors:corsOptions });
   
    io.on('connection',(socket)=>{
        //handle event 
        //making roomId
        console.log('Websocket is connectioned...')
        socket.on('joinChat',({userId,targetUserId,firstName})=>{
            // const roomId=[userId ,targetUserId].sort().join('_');
            const roomId=getSecretRoomId({userId,targetUserId});
            console.log(firstName,"join room",roomId);
            socket.join(roomId);
        })
        socket.on('sendMessage',async({userId,targetUserId,text,firstName,photoUrl})=>{
           try {
            const roomId=getSecretRoomId({userId,targetUserId});
            console.log("sendMessage join roomId",roomId)

            let chat=await Chat.findOne({participantes:
                {$all:[userId,targetUserId]}
            })
          
            if(!chat){
            chat= new Chat({
                     participantes:[userId,targetUserId],
                     messages:[],
                })
              
            }
           
            chat.messages.push({
                text,senderId:userId
            })
            await chat.save()
    
            io.to(roomId).emit('messageRecieved',{text,firstName,photoUrl,userId});
           } catch (error) {
            console.log("Error in socket",error)
           
           }
        })
    })

}



module.exports=intilizedSocket;