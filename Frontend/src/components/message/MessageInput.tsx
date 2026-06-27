import { Send } from "lucide-react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { addMessage } from "@/redux/slice/messageslice";
import { useDispatch } from "react-redux";
import { getsocket } from "@/services/socket";
import { Paperclip } from "lucide-react";
export function MessageInput() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { id } = useParams();
const [files, setFiles] = useState<File[]>([]);
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
      console.log("SEND MESSAGE CALLED");
    if (!message.trim()&&files.length==0) return; // prevent empty

    const formData = new FormData();

formData.append("content", message);

files.forEach((file) => {
  formData.append("attachments", file);
});

    try {
      const res = await fetch(
        `http://localhost:3000/api/messages/${id}/send`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
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
            attachements:msg.attachements,
            senderId: msg.sender,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            status: msg.status,
          },
        })
      );
setMessage("");
setFiles([]);
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
      <label>
  <Paperclip />
  <input
    type="file"
    multiple
    className="hidden"
    onChange={(e) => {
    if (!e.target.files) return;

    setFiles(Array.from(e.target.files));
  }}
  />
</label>


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