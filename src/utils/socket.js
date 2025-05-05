
const socket=require('socket.io');
const corsOptions = {
    origin: ['http://localhost:3000','https://dev-tinder-frontend-psi.vercel.app','https://devtinder-frontend-web.onrender.com'],
    credentials: true,
  };
const intilizedSocket = (server)=>{
  
    const io=socket(server,{cors:corsOptions });
   
    io.on('connection',(socket)=>{
        //handle event 
        //making roomId
        console.log('Websocket is connectioned...')
        socket.on('joinChat',({userId,targetUserId,firstName})=>{
            const roomId=[userId ,targetUserId].sort().join('_');
            console.log(firstName,"join room",roomId);
            socket.join(roomId);
        })
        socket.on('sendMessage',({userId,targetUserId,text,firstName,photoUrl})=>{
            const roomId=[userId ,targetUserId].sort().join('_');
            console.log("sendMessage",roomId)
            io.to(roomId).emit('messageRecieved',{text,firstName,photoUrl});
        })
    })

}



module.exports=intilizedSocket;