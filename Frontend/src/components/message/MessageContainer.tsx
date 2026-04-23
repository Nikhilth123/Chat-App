import { useEffect } from "react";
import { MessageBubble } from "./MessageBubble.tsx"
import { useAppSelector } from "@/hooks/reduxhooks"
import { useDispatch } from "react-redux";
import { setMessages } from "@/redux/slice/messageslice";
export function MessagesContainer() {
const dispatch=useDispatch(); 
  // const messages = [
  //   { id: 1, text: "Hello bro", sender: "other" },
  //   { id: 2, text: "Hi bro", sender: "me" },
  //   { id: 3, text: "How are you?", sender: "other" },
  //   { id: 4, text: "Fine", sender: "me" }
  // ]

  const messages = useAppSelector((state) => state.message.messages)||[
    { id: 1, text: "Hello bro", sender: "other" },
    { id: 2, text: "Hi bro", sender: "me" },
    { id: 3, text: "How are you?", sender: "other" },
    { id: 4, text: "Fine", sender: "me" }
  ];
  const selectedChatId = useAppSelector((state) => state.chat.selectedChat);
  const fetchMessages = async () => { 
    try{
    const res = await fetch(`http://localhost:3000/api/messages/${selectedChatId}`,{
     method:"GET",
     credentials:"include",
     headers:{
      "Content-Type":"application/json",
      }
    });
    const data = await res.json();
    console.log("messagesdata:", data);
    // dispatch(setMessages({ chatId: selectedChatId, messages: data }));
  }catch(err){
    console.log(err);
  }

  }
  console.log("selectedChatId:", selectedChatId);
  useEffect(() => {
    if(selectedChatId){
      fetchMessages();
    }
  }, [selectedChatId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg}/>
      ))}

    </div>
  )
}