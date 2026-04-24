import store from "@/redux/store";
import { addMessage } from "@/redux/slice/messageslice";
import {
  setTyping,
  removeTyping,
  setOnlineUsers,
} from "@/redux/slice/realtimeslice";
import { getsocket } from "./socket";

export const initSocketListeners = () => {
  const socket = getsocket();

  // ===== MESSAGE =====
  socket.off("receive_message");
  socket.on("receive_message", (msg) => {
    console.log("New message:", msg);

    // map backend → frontend
    const message = {
      _id: msg._id,
      chatId: msg.chatId,
      text: msg.content,
      senderId: msg.sender,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      status: msg.status || "sent",
    };

    store.dispatch(
      addMessage({
        chatId: message.chatId,
        message,
      })
    );
  });

  // ===== TYPING =====
  socket.off("typing");
  socket.on("typing", ({ chatId, userId }) => {
    console.log(`User ${userId} is typing in chat ${chatId}`);
    store.dispatch(setTyping({ chatId, userId }));
  });

  socket.off("stop_typing");
  socket.on("stop_typing", ({ chatId, userId }) => {
    console.log(`User ${userId} stopped typing in chat ${chatId}`);
    store.dispatch(removeTyping({ chatId, userId }));
  });

  // ===== ONLINE USERS =====
  socket.off("online_users");
  socket.on("online_users", (users: string[]) => {
    store.dispatch(setOnlineUsers(users));
  });
};