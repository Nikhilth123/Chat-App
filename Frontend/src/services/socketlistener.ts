import store from "@/redux/store";
import { addMessage } from "@/redux/slice/messageslice";
import { getsocket } from "./socket";
export const initSocketListeners = () => {
  const socket = getsocket();
  socket.on("receive_message", (message) => {
    console.log("New message:", message);

    store.dispatch(addMessage(message));
  });

  socket.on("online_users", (users) => {
    console.log("Online users:", users);
  });

};