import { useAppSelector } from "@/hooks/reduxhooks";
import { motion } from "framer-motion";
import MessageAttachment from "./MessageAttachement";

interface Props {
  message: any;
  isGrouped: boolean;
}

export function MessageBubble({ message, isGrouped }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const isMe = message.senderId === user?._id;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderStatus = () => {
    if (!isMe) return null;

    const s = message.status?.[0];

    if (!s || !s.delivered) return "✓";
    if (!s.seen) return "✓✓";

    return (
      <span className="text-blue-500 font-semibold">
        ✓✓
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${
        isMe ? "justify-end" : "justify-start"
      } ${isGrouped ? "mt-1" : "mt-3"}`}
    >
      <div
        className={`
          px-3 py-2 rounded-2xl
          max-w-[75%]
          shadow-sm
          ${
            isMe
              ? "bg-green-500 text-white rounded-br-md"
              : "bg-white dark:bg-gray-800 text-black dark:text-white rounded-bl-md border dark:border-gray-700"
          }
        `}
      >
        {/* Attachments */}
        {message.attachements?.length > 0 && (
          <div className="space-y-2 mb-2">
            {message.attachements.map((file: any) => (
              <MessageAttachment
                key={file._id}
                file={file}
              />
            ))}
          </div>
        )}

        {/* Text Message */}
        {message.text && (
          <p className="whitespace-pre-wrap break-words text-[15px]">
            {message.text}
          </p>
        )}

        {/* Time & Status */}
        <div className="flex justify-end items-center gap-1 mt-1 text-[11px] opacity-80">
          <span>{time}</span>

          {isMe && renderStatus()}
        </div>
      </div>
    </motion.div>
  );
}