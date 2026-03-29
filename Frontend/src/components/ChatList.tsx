import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ChatItem from "./ChatItem"
import { useEffect, useState} from "react"
import { useAppSelector } from "@/hooks/reduxhooks"
import { setChats } from "@/redux/slice/chatslice"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Check, Loader2 } from "lucide-react";
export  function ChatList() {
  const chats =useAppSelector((state)=>state.chat.chats);
  const [searchstring,setsearchstring]=useState<string>("");
  const [user,setuser]=useState([]);
  const [selecteduser,setselecteduser]=useState<any>(null);
  const [loading,setloading]=useState<boolean>(false);
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

  const fetchsearcheduser=async()=>{
    try{
      setloading(true);
      const res=await fetch(`http://localhost:3000/api/user/search?query=${searchstring}`,{
        credentials:"include",
      });
      const data=await res.json();
      console.log(data);
      setloading(false);
      setuser(data.users);
    }
    catch(err){
      console.log("error hai");
      console.log(err);
    }
  }
  const createchat=async()=>{
    if(!selecteduser)return;
    try{
      const res=await fetch(`http://localhost:3000/api/chat/create/${selecteduser._id}`,{
        method:"POST",
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
},[]);
useEffect(()=>{
  const delay=setTimeout(() => {
    if(searchstring.trim()!==""){
      fetchsearcheduser();
    }
    
  }, 300);
return ()=>clearTimeout(delay)
},[searchstring])


  return (
    <div className="w-80 border-r border-border flex flex-col h-screen bg-background w-full">

      
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Chats</h2>

           <Sheet>
  <SheetTrigger asChild> 
    <div>
    <Button size="icon" variant="ghost">
          <Plus size={18}/>
        </Button>
        </div>
        </SheetTrigger>
       
  

<SheetContent className="flex flex-col h-full">

  {/* HEADER */}
  <SheetHeader>
    <SheetTitle>Create Chat</SheetTitle>
    <SheetDescription>
      Search and select a user to start chatting
    </SheetDescription>
  </SheetHeader>

  {/* SEARCH INPUT */}
  <div className="p-3">
    <Input
      placeholder="Search users..."
      value={searchstring}
      onChange={(e) => setsearchstring(e.target.value)}
      autoFocus
    />
  </div>

  {/* USER LIST */}
  <ScrollArea className="flex-1 px-2">

    {/* LOADING */}
    {loading && (
      <div className="flex justify-center mt-4">
        <Loader2 className="animate-spin" />
      </div>
    )}

    {/* EMPTY STATE */}
    {!loading && searchstring && user.length === 0 && (
      <div className="text-center text-sm text-muted-foreground mt-4">
        No users found
      </div>
    )}

    {/* USER LIST */}
    {user.map((u: any) => (
      <div
        key={u._id}
        onClick={() =>
          setselecteduser(
            selecteduser?._id === u._id ? null : u
          )
        }
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition
          hover:bg-muted
          ${
            selecteduser?._id === u._id
              ? "bg-primary/10 border border-primary"
              : ""
          }
        `}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
            {u.username[0].toUpperCase()}
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <span className="font-medium">{u.username}</span>
            <span className="text-xs text-muted-foreground">
              Click to select
            </span>
          </div>
        </div>

        {/* RIGHT SIDE (CHECK ICON) */}
        {selecteduser?._id === u._id && (
          <Check size={18} className="text-primary" />
        )}
      </div>
    ))}
  </ScrollArea>

  {/* FOOTER */}
  <div className="p-3 border-t">
    <Button
      className="w-full"
      disabled={!selecteduser}
      onClick={createchat}
    >
      {selecteduser
        ? `Start chat with ${selecteduser.username}`
        : "Select a user"}
    </Button>
  </div>

</SheetContent>
</Sheet>

       
      </div>

    
      <div className="p-3">
        <Input placeholder="Search chats..." />
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">

          {chats.length!==0?(chats.map(chat => (
            <ChatItem key={chat._id} chat={chat} />
          )))
          :<div>NO chat found</div>
        }

        </div>
      </ScrollArea>

     


    </div>
  )
}