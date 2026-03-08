import { Phone, Video, MoreVertical } from "lucide-react"

export function ChatHeader({ chatId }: { chatId?: string }) {

  return (
    <div className="flex items-center justify-between p-4 border-b">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>

        <div>
          <p className="font-semibold">User {chatId}</p>
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