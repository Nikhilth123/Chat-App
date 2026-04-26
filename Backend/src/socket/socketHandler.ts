import { Server } from "socket.io";
import { redis } from "../Config/redis";

export const socketstart = (io: Server) => {



  const getOnlineUsers = async () => {
    const users = await redis.smembers("online_users");
    const onlineUsers: string[] = [];

    for (const userId of users) {
      const sockets = await redis.smembers(`user:${userId}:sockets`);
      let active = false;

      for (const socketId of sockets) {
        const exists = await redis.exists(`user:${userId}:socket:${socketId}`);

        if (exists) {
          active = true;
          break;
        } else {
          await redis.srem(`user:${userId}:sockets`, socketId);
        }
      }

      if (active) {
        onlineUsers.push(userId);
      } else {
        await redis.srem("online_users", userId);
      }
    }

    return onlineUsers;
  };

  const emitOnlineUsers = async () => {
    const users = await getOnlineUsers();
    io.emit("online_users", users);
  };

  const emitTyping = async (chatId: string) => {
    const keys = await redis.keys(`typing:${chatId}:*`);
    const users = keys.map((k) => k.split(":")[2]);

    io.to(chatId).emit("typing_users", { chatId, users });
  };



  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);


    socket.on("join", async (userId: string) => {
      if (!userId) return;

      socket.data.userId = userId;
      socket.data.socketKey = `user:${userId}:socket:${socket.id}`;

      await redis.set(socket.data.socketKey, "1", "EX", 30);
      await redis.sadd(`user:${userId}:sockets`, socket.id);
      await redis.sadd("online_users", userId);

      await emitOnlineUsers();
    });

  
    socket.on("heartbeat", async () => {
      const socketKey = socket.data.socketKey;
      if (!socketKey) return;

      await redis.set(socketKey, "1", "EX", 30);
    });

  
    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
    });

    socket.on("leave_chat", (chatId: string) => {
      socket.leave(chatId);
    });

    socket.on("typing", async ({ chatId }) => {
      const userId = socket.data.userId;
      if (!userId) return;

      await redis.set(`typing:${chatId}:${userId}`, "1", "EX", 5);
      await emitTyping(chatId);
    });

    socket.on("stop_typing", async ({ chatId }) => {
      const userId = socket.data.userId;
      if (!userId) return;

      await redis.del(`typing:${chatId}:${userId}`);
      await emitTyping(chatId);
    });

    socket.on("disconnect", async () => {
      const { userId, socketKey } = socket.data;
      if (!userId || !socketKey) return;

      await redis.del(socketKey);
      await redis.srem(`user:${userId}:sockets`, socket.id);

      const remaining = await redis.scard(`user:${userId}:sockets`);
      if (remaining === 0) {
        await redis.srem("online_users", userId);
      }

      await emitOnlineUsers();
    });
  });

 
  setInterval(async () => {
    await emitOnlineUsers();
  }, 5000);
};