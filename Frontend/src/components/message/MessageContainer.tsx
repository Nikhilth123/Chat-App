import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useAppSelector } from "@/hooks/reduxhooks";
import { useDispatch } from "react-redux";
import { setMessages } from "@/redux/slice/messageslice";
import { getsocket } from "@/services/socket";

export function MessagesContainer() {
  const dispatch = useDispatch();

  const selectedChatId = useAppSelector(
    (state) => state.chat.selectedChat
  );

  const user = useAppSelector((state) => state.auth.user);

  // ===== GET MESSAGES FROM REDUX =====
  const chatMessages = useAppSelector((state) =>
    selectedChatId ? state.message.byChatId[selectedChatId] : null
  );

  const messages = chatMessages
    ? chatMessages.ids.map((id) => chatMessages.entities[id])
    : [];

  // ===== TYPING USERS =====
  const typingUsers = useAppSelector((state) =>
    selectedChatId ? state.realtime.typingUsers[selectedChatId] :undefined
  );

  // remove yourself
  const filteredTypingUsers = (typingUsers || []).filter(
    (uid) => uid !== user?._id
  );

  // ===== FETCH MESSAGES =====
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
        status: msg.status || "sent",
      }));

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

  // ===== FETCH ON CHAT CHANGE =====
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages();
    }
  }, [selectedChatId]);

  // ===== SOCKET JOIN / LEAVE =====
  useEffect(() => {
    const socket = getsocket();
    if(!socket){
        console.log("Socket not initialized. Call connectsocket(userId) first.");
        return;
    }
    if (!selectedChatId) return;

    socket.emit("join_chat", selectedChatId);

    return () => {
      socket.emit("leave_chat", selectedChatId);
    };
  }, [selectedChatId]);

  // ===== AUTO SCROLL =====
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, filteredTypingUsers.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      
      {/* ===== MESSAGES ===== */}
      {messages.map((msg, index) => {
        const prevMsg = messages[index - 1];

        const isGrouped =
          prevMsg && prevMsg.senderId === msg.senderId;

        return (
          <MessageBubble
            key={msg._id}
            message={msg}
            isGrouped={isGrouped}
          />
        );
      })}

      {/* ===== TYPING INDICATOR ===== */}
      {filteredTypingUsers.length > 0 && (
        <div className="flex items-center gap-2 px-2 text-gray-400 text-sm">
          <span>Typing</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      )}

      {/* ===== SCROLL ANCHOR ===== */}
      <div ref={bottomRef} />
    </div>
  );
}