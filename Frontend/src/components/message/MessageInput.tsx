import { Send } from "lucide-react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { addMessage } from "@/redux/slice/messageslice";
import { useDispatch } from "react-redux";
import { getsocket } from "@/services/socket";

export function MessageInput() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { id } = useParams();

  const socket = getsocket();
 
  const typingTimeout = useRef<any>(null);

   if(!socket){
    console.error("socket not initialized. Call connectsocket(userId) first.");
    return null; // or some fallback UI
  }
  // ===== HANDLE TYPING =====
  const handleChange = (e: any) => {
    const value = e.target.value;
    setMessage(value);

    if (!id) return;

    // emit typing
    socket.emit("typing", { chatId: id });

    // debounce stop typing
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { chatId: id });
    }, 1000);
  };

  // ===== SEND MESSAGE =====
  const sendMessage = async () => {
    if (!message.trim()) return; // prevent empty

    try {
      const res = await fetch(
        `http://localhost:3000/api/messages/${id}/send`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: message }),
        }
      );

      const data = await res.json();
      const msg = data.data;

      // stop typing immediately
      socket.emit("stop_typing", { chatId: id });

      // add to redux
      dispatch(
        addMessage({
          chatId: msg.chatId,
          message: {
            _id: msg._id,
            chatId: msg.chatId,
            text: msg.content,
            senderId: msg.sender,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            status: "sent",
          },
        })
      );

      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ===== ENTER KEY SUPPORT =====
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t">
      <input
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-lg"
      />

      <button
        onClick={sendMessage}
        className="p-2 bg-green-500 text-white rounded-lg"
      >
        <Send size={18} />
      </button>
    </div>
  );
}