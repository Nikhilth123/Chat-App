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
export const getsocket=():Socket|null=>{
    if(!socket){
        console.log("Socket not initialized. Call connectsocket(userId) first.");
        return null;
    }
    return socket;
}
export const disconnectsocket=()=>{
    if(socket){
        socket.disconnect();
        socket=null;
    }
};

