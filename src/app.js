require('dotenv').config()
const http=require('http');
const intilizedSocket=require('./utils/socket')
const connectDb = require("./config/database");
const express = require("express");
const cors=require('cors');
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/auth');
const connectionRouter=require('./routes/connectionRequest');
const userRouter=require('./routes/user');
const profileRouter=require('./routes/profile');
const paymentRouter=require('./routes/payment');
const chatRouter=require('./routes/chat')
const app = express();
const server=http.createServer(app);
intilizedSocket(server);

app.use(cors({
  origin: ['http://localhost:3000', 'https://dev-tinder-frontend-psi.vercel.app', 'https://devtinder-frontend-web.onrender.com'],
  credentials: true
}));

app.use(cookieParser())
app.use(express.json());
app.use('/',authRouter);
app.use('/',connectionRouter);
app.use('/',profileRouter);
app.use('/',userRouter);
app.use('/',paymentRouter);
app.use('/',chatRouter);



connectDb()
  .then(() => {
    console.log("DB connected Sucessfully");
    server.listen(7777, function () {
      console.log("Server is running in port 7777...");
    });
  })
  .catch((error) => {
    console.error("Something went wrong in DB", error);
  });