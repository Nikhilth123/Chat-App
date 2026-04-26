import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectsocket = (userId: string): Socket => {
  if (socket) return socket;

  socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  return socket;
};

export const getsocket = (): Socket | null => {
  return socket;
};

export const disconnectsocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};