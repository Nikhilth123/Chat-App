import { useAppSelector } from "@/hooks/reduxhooks";

import { motion } from "framer-motion";


export function MessageBubble({ message, isGrouped }: any) {
  const user = useAppSelector((state) => state.auth.user);
  const isMe = message.senderId === user?._id;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

 console.log("STATUS:", message.status);
const renderStatus = () => {
  if (!isMe) return null;

  const s = message.status?.[0];


  if (!s) return "✓"; // sent
  if (!s.delivered) return "✓";
  if (s.delivered && !s.seen) return "✓✓";
  if (s.seen) return "✓✓";

  return "";
};
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} ${
        isGrouped ? "mt-1" : "mt-3"
      }`}
    >
      <div
        className={`
          px-4 py-2 rounded-2xl 
          max-w-[70%] 
          break-words whitespace-pre-wrap 
          shadow-sm
          ${
            isMe
              ? "bg-green-500 text-white rounded-br-none"
              : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
          }
        `}
      >
        <div>{message.text}</div>

        <div className="flex justify-end items-center gap-1 text-[10px] mt-1 opacity-70">
          <span>{time}</span>
         <span
  className={message.status?.[0]?.seen ? "text-blue-600 font-bold" : ""}
>
  {renderStatus()}
</span>
        </div>
      </div>
    </motion.div>
  );
}