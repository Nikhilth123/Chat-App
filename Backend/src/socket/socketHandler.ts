import { Server } from "socket.io";
import { redis } from "../Config/redis";
import { Message } from "../Models/chat";

export const socketstart = (io: Server) => {

  // =========================
  // 🟢 ONLINE USERS (TTL SAFE)
  // =========================
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

  // =========================
  // 🔵 TYPING (TTL BASED)
  // =========================
  const emitTyping = async (chatId: string) => {
    const keys = await redis.keys(`typing:${chatId}:*`);
    const users = keys.map((k) => k.split(":")[2]);

    io.to(chatId).emit("typing_users", { chatId, users });
  };

  // =========================
  // 🔌 SOCKET CONNECTION
  // =========================
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // ===== JOIN USER =====
    socket.on("join", async (userId: string) => {
      if (!userId) return;

      socket.data.userId = userId;
      socket.data.socketKey = `user:${userId}:socket:${socket.id}`;

      await redis.set(socket.data.socketKey, "1", "EX", 30);
      await redis.sadd(`user:${userId}:sockets`, socket.id);
      await redis.sadd("online_users", userId);

      await emitOnlineUsers();
    });

    // ===== HEARTBEAT =====
    socket.on("heartbeat", async () => {
      const socketKey = socket.data.socketKey;
      if (!socketKey) return;

      await redis.set(socketKey, "1", "EX", 30);
    });

    // ===== CHAT ROOMS =====
    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
    });

    socket.on("leave_chat", (chatId: string) => {
      socket.leave(chatId);
    });

    // =========================
    // ✍️ TYPING
    // =========================
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

    // =========================
    // 📦 MESSAGE DELIVERED
    // =========================
    socket.on("message_delivered", async ({ messageId }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) return;

        await Message.updateOne(
          {
            _id: messageId,
            "status.userId": userId,
          },
          {
            $set: {
              "status.$.delivered": true,
            },
          }
        );

        const message = await Message.findById(messageId);
        if (!message) return;

        io.to(message.chatId.toString()).emit("message_status_update", {
          messageId,
          userId,
          type: "delivered",
        });
      } catch (err) {
        console.error("Error in message_delivered:", err);
      }
    });

    // =========================
    // 👁️ MESSAGE SEEN (OPTIMIZED)
    // =========================
    socket.on("messages_seen", async ({ chatId }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) return;

        // find messages to emit updates
        const messages = await Message.find({
          chatId,
          sender: { $ne: userId },
          "status.userId": userId,
          "status.seen": false,
        });

        // batch update
        await Message.updateMany(
          {
            chatId,
            sender: { $ne: userId },
            "status.userId": userId,
            "status.seen": false,
          },
          {
            $set: {
              "status.$[elem].seen": true,
              "status.$[elem].delivered": true,
            },
          },
          {
            arrayFilters: [{ "elem.userId": userId }],
          }
        );

        // emit per message (important for frontend)
        for (const msg of messages) {
          io.to(chatId).emit("message_status_update", {
            messageId: msg._id,
            userId,
            type: "seen",
          });
        }

      } catch (err) {
        console.error("Error in messages_seen:", err);
      }
    });

    // =========================
    // ❌ DISCONNECT
    // =========================
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

  // =========================
  // 🔁 CLEANUP LOOP
  // =========================
  setInterval(async () => {
    await emitOnlineUsers();
  }, 5000);
};