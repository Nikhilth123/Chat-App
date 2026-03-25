import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ChatItem from "./ChatItem"

export  function ChatList() {

  const chats = [
    { id: "1", name: "John", lastMessage: "Hey bro", unread: 2 },
    { id: "2", name: "Alice", lastMessage: "Meeting tomorrow", unread: 0 },
    { id: "3", name: "David", lastMessage: "Send the file", unread: 4 }
  ]

  return (
    <div className="w-80 border-r border-border flex flex-col h-screen bg-background w-full">

      
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Chats</h2>

        <Button size="icon" variant="ghost">
          <Plus size={18}/>
        </Button>
      </div>

    
      <div className="p-3">
        <Input placeholder="Search chats..." />
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">

          {chats.map(chat => (
            <ChatItem key={chat.id} chat={chat} />
          ))}

        </div>
      </ScrollArea>

    </div>
  )
}