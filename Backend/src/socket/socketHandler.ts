import { Server } from "socket.io";
import { redis } from "../Config/redis";

export const socketstart = (io: Server) => {
  io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        console.log("Total clients connected:", io.engine.clientsCount);
    // join user (online tracking)
    socket.on("join", async (userId: string) => {
      socket.data.userId = userId;

      await redis.incr(`online_count:${userId}`);
      await redis.sadd("online_users", userId);

      const users = await redis.smembers("online_users");
      io.emit("online_users", users);
    });

    // join chat room
    socket.on("join_chat", (chatId: string) => {
        console.log(`Socket ${socket.id} joining chat ${chatId}`);
      socket.join(chatId);
    });

    socket.on("leave_chat", (chatId: string) => {
        console.log(`Socket ${socket.id} leaving chat ${chatId}`);
      socket.leave(chatId);
    });
    
    // typing
    socket.on("typing", ({ chatId }) => {
        console.log(`Socket ${socket.id} is typing in chat ${chatId}`);
      const userId = socket.data.userId;
      console.log(`Emitting typing event for user ${userId} in chat ${chatId}`);
      socket.to(chatId).emit("typing", { chatId, userId });
    });

    socket.on("stop_typing", ({ chatId }) => {
        console.log(`Socket ${socket.id} stopped typing in chat ${chatId}`);
      const userId = socket.data.userId;
      socket.to(chatId).emit("stop_typing", { chatId,userId });
    });

    // disconnect
    socket.on("disconnect", async () => {
        console.log("Client disconnected:", socket.id);
      const userId = socket.data.userId;

      if (userId) {
        const count = await redis.decr(`online_count:${userId}`);

        if (count <= 0) {
          await redis.srem("online_users", userId);
          await redis.del(`online_count:${userId}`);
        }

        const users = await redis.smembers("online_users");
        io.emit("online_users", users);
      }
    });
  });
};