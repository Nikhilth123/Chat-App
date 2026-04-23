import { useAppSelector } from "@/hooks/reduxhooks"
import { Phone, Video, MoreVertical } from "lucide-react"


export function ChatHeader({ chatId }: { chatId?: string }) {
const chats=useAppSelector((state) => state.chat.chats);
const user=useAppSelector((state) => state.auth.user);
const chat = chats.find((c) => c._id === chatId);
let otherUser = chat?.participants.find((u) => u.user._id !== user?._id)?.user??user;

  return (
    <div className="flex items-center justify-between p-4 border-b">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>

        <div>
          <p className="font-semibold">{otherUser?.userName}</p>
          <p className="text-sm text-gray-500">online</p>
        </div>  

      </div>

      <div className="flex gap-4">
        <Phone size={20}/>
        <Video size={20}/>
        <MoreVertical size={20}/>
      </div>

    </div>
  )
}