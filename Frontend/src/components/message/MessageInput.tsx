import { Send } from "lucide-react"
import { use, useState } from "react"
import { useParams } from "react-router-dom";
import { addMessage} from "@/redux/slice/messageslice";
import { useDispatch } from "react-redux";
export function MessageInput() {
const dispatch=useDispatch();
  const [message, setMessage] = useState("");
  const { id} = useParams();
  console.log("Chat ID from URL:", id);

  const sendMessage = async() => {
   try{
    const res = await fetch(`http://localhost:3000/api/messages/${id}/send`,{
     method:"POST",
     credentials:"include",
     headers:{
      "Content-Type":"application/json",
     },
     body:JSON.stringify({ content: message })
    });
    const data = await res.json();
    console.log("Message sent:", data);
    setMessage("");
   dispatch(addMessage({
  chatId: data.data.chatId,
  message: {
    _id: data.data._id,
    chatId: data.data.chatId,
    text: data.data.content,       // mapping
    senderId: data.data.sender,    // mapping
    createdAt: data.data.createdAt,
    updatedAt: data.data.updatedAt
  }
}))
   }catch(err){
    console.error("Error sending message:", err);
   }
  }

  return (
    <div className="flex items-center gap-2 p-4 border-t">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-lg"
      />

      <button
        onClick={sendMessage}
        className="p-2 bg-green-500 text-white rounded-lg"
      >
        <Send size={18}/>
      </button>

    </div>
  )
}