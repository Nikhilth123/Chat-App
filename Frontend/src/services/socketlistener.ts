import store from "@/redux/store";
import { addMessage, updateMessageStatus } from "@/redux/slice/messageslice";
import {
  setTyping,
  setOnlineUsers,
} from "@/redux/slice/realtimeslice";
import { getsocket } from "./socket";

export const initSocketListeners = () => {
  const socket = getsocket();
  if (!socket) return;

  // ===== MESSAGE =====
  socket.off("receive_message");
  socket.on("receive_message", (msg) => {
    const message = {
      _id: msg._id,
      chatId: msg.chatId,
      text: msg.content,
      senderId: msg.sender,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      status: msg.status ||[],
    };

    store.dispatch(
      addMessage({
        chatId: message.chatId,
        message,
      })
    );

     socket.emit("message_delivered", {
    messageId: msg._id,
  });
  });

  socket.on("message_status_update", ({ messageId, userId, type }) => {
  store.dispatch(updateMessageStatus({ messageId, userId, type }))
})
  // ===== TYPING (TTL BASED) =====
  socket.off("typing_users");
  socket.on("typing_users", ({ chatId, users }) => {
    store.dispatch(setTyping({ chatId, users }));
  });

  // ===== ONLINE USERS =====
  socket.off("online_users");
  socket.on("online_users", (users: string[]) => {
    store.dispatch(setOnlineUsers(users));
  });
};