import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/reduxhooks";
import { connectsocket, disconnectsocket, getsocket } from "@/services/socket";
import { initSocketListeners } from "@/services/socketlistener";

export function SocketProvider({ children }: any) {
  const user = useAppSelector((state) => state.auth.user);
  const hasConnected = useRef(false);

  useEffect(() => {
  const handleClose = () => {
    disconnectsocket();
  };

  window.addEventListener("beforeunload", handleClose);

  return () => {
    window.removeEventListener("beforeunload", handleClose);
  };
}, []);

  useEffect(() => {
    if (!user?._id || hasConnected.current) return;

    hasConnected.current = true;

    connectsocket(user._id);

    const socket = getsocket();
if(!socket){
    console.error("Failed to get socket instance after connection.");
    return;
}
    // ✅ wait for connection
    socket.once("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("join", user._id);   // ✅ NOW SAFE
    });

    initSocketListeners();

    return () => {
      disconnectsocket();
      hasConnected.current = false;
    };
  }, [user?._id]);

  return children;
}