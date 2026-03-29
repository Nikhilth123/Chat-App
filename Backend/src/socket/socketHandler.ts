import { Server } from "socket.io";;
import {redis} from "../Config/redis"
const usersocket:Record<string,string>={};

export const socketstart=(io:Server)=>{
    io.on("connection",(socket)=>{
        console.log("user connected",socket.id);
        
        socket.on("join",async(userid:string)=>{
            usersocket[userid]=socket.id;
            await redis.set(`user:${userid}`,socket.id);
        });

        socket.on("sendmessage",async(receiverid,message)=>{
            console.log("message receive for  user id  ",receiverid,"message is",message)
            const receiversocketid=await redis.get(`user:${receiverid}`);
            if(receiversocketid){
                io.to(receiversocketid).emit("receiveMessage",message);
            }
        });

        socket.on("disconnect",async()=>{
            for(const userid in usersocket){
                if(usersocket[userid]===socket.id){
                    delete usersocket[userid];
                    await redis.del(`user:${userid}`);
                }
            }
        });

    });
}
