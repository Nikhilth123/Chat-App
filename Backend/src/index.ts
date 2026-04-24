import express,{Application, urlencoded} from 'express';
import { errorHandler } from './Middlewares/errormiddlewares';
import Auth from './Routes/Auth';
import cors from 'cors';
import connectDB from './Config/db';
import { Server } from 'socket.io';
import http from "http";
import { socketstart } from './socket/socketHandler';
import chat from './Routes/chat'
import cookieParser from "cookie-parser";
import user from './Routes/user'
import message from './Routes/message';
import { setIO } from './socket/socketInstance';
const app:Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
connectDB()
.then(()=>{
  console.log("Database connected successfully");
})
.catch((error)=>{
  console.error("Database connection failed:",error);
});
app.use(urlencoded({extended:true}));
app.use('/api/auth',Auth);
app.use('/api/chats',chat);
app.use('/api/user',user);
app.use('/api/messages',message);

app.use(errorHandler);
const server=http.createServer(app);
const io=new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true
  },
});
setIO(io);
socketstart(io);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});


