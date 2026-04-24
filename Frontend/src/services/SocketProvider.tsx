import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/reduxhooks";
import { connectsocket, disconnectsocket } from "@/services/socket";
import { initSocketListeners } from "@/services/socketlistener";

export function SocketProvider({ children }: any) {
  const user = useAppSelector((state) => state.auth.user);
  const hasConnected = useRef(false);

  useEffect(() => {
    if (!user?._id || hasConnected.current) return;

    hasConnected.current = true;

    connectsocket(user._id);
    initSocketListeners();

    return () => {
      disconnectsocket();
      hasConnected.current = false;
    };
  }, [user?._id]);

  return children;
}