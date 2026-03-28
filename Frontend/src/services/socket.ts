import {io,Socket} from 'socket.io-client';
let socket:Socket|null=null;
export const connectsocket=(userid:string):Socket=>{
    if(socket)return socket;
    console.log("socket connection sent ");
    socket=io("http://localhost:3000",{
        withCredentials:true,
        query:{userid},
    })
    return socket;
}
export const getsocket=()=>{
    if(!socket){
        throw new Error("socket not connected");
    }
    return socket;
}
export const disconnectsocket=()=>{
    if(socket){
        socket.disconnect();
        socket=null;
    }
};

