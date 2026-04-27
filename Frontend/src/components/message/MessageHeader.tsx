import { useAppSelector } from "@/hooks/reduxhooks";
import { Phone, Video, MoreVertical } from "lucide-react";

export function ChatHeader({ chatId }: { chatId?: string }) {
  const chats = useAppSelector((state) => state.chat.chats);
  const user = useAppSelector((state) => state.auth.user);
  const onlineUsers = useAppSelector(
    (state) => state.realtime.onlineUsers || []
  );

  const chat = chats.find((c) => c._id === chatId);

  const otherUser =
    chat?.participants.find((u) => u.user._id !== user?._id)?.user ?? user;

 const isOnline = otherUser?._id
  ? onlineUsers.includes(otherUser._id)
  : false;

  console.log("otherUserId:", otherUser?._id);
console.log("onlineUsers:", onlineUsers);
  return (
    <div className="flex items-center justify-between p-4 border-b">
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-400 rounded-full"></div>

          {/* 🟢 online dot */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div>
          <p className="font-semibold">{otherUser?.userName}</p>

          <p className="text-sm text-gray-500">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Phone size={20} />
        <Video size={20} />
        <MoreVertical size={20} />
      </div>
    </div>
  );
}