import { useEffect } from "react";
import { MessageBubble } from "./MessageBubble.tsx";
import { useAppSelector } from "@/hooks/reduxhooks";
import { useDispatch } from "react-redux";
import { setMessages } from "@/redux/slice/messageslice";

export function MessagesContainer() {
  const dispatch = useDispatch();

  const selectedChatId = useAppSelector(
    (state) => state.chat.selectedChat
  );

  const chatMessages = useAppSelector((state) =>
    selectedChatId ? state.message.byChatId[selectedChatId] : null
  );

  const messages = chatMessages
    ? chatMessages.ids.map((id) => chatMessages.entities[id])
    : [];

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/messages/${selectedChatId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
       
          const transformedMessages = data.data.map((msg: any) => ({
      _id: msg._id,
      chatId: msg.chatId,
      text: msg.content,
      senderId: msg.sender,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));
     console.log("Fetched messages:", transformedMessages);
      dispatch(
        setMessages({
          chatId: selectedChatId!,
          messages: transformedMessages, 
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages();
    }
  }, [selectedChatId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}
    </div>
  );
}