import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ChatItem from "./ChatItem"
import { useEffect} from "react"
import { useAppSelector } from "@/hooks/reduxhooks"

export  function ChatList() {
  const chat =useAppSelector((state)=>state.chat.user);

  const fetchallchats=async()=>{
    try{
    const res=await fetch('http://localhost:3000/api/chats/my-chats',{
      method:"GET",
      credentials:"include",
    })
    const data=await res.json();
    console.log(data);
  }
  catch(err){
    console.log(err);
  }
  }
useEffect(()=>{
  fetchallchats();
},[])


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