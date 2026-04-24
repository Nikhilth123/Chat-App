import { Server } from "socket.io";

let io: Server;

export const setIO = (ioInstance: Server) => {
  io = ioInstance;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};