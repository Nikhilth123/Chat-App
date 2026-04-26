import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/reduxhooks";
import { connectsocket, disconnectsocket, getsocket } from "@/services/socket";
import { initSocketListeners } from "@/services/socketlistener";

export function SocketProvider({ children }: any) {
  const user = useAppSelector((state) => state.auth.user);
  const hasConnected = useRef(false);

  // ===== CONNECT =====
  useEffect(() => {
    if (!user?._id || hasConnected.current) return;

    hasConnected.current = true;

    const socket = connectsocket(user._id);

    socket.once("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("join", user._id);
      initSocketListeners(); // ✅ important
    });

    return () => {
      disconnectsocket();
      hasConnected.current = false;
    };
  }, [user?._id]);

  // ===== HEARTBEAT =====
  useEffect(() => {
    if (!user?._id) return;

    const interval = setInterval(() => {
      const socket = getsocket();
      if (!socket) return;

      socket.emit("heartbeat");
    }, 10000);

    return () => clearInterval(interval);
  }, [user?._id]);

  return children;
}