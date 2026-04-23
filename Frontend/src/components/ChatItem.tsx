import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxhooks";
import {selectChat} from "@/redux/slice/chatslice"
import { useDispatch } from "react-redux";
export default function ChatItem({ chat }: any) { 
  const user = useAppSelector((state) => state.auth.user);
// if(!user)return <div>Loading...</div>
const dispatch=useDispatch();
  let otherUser = chat.participants?.find(
    (p: any) => p.user?._id !== user?._id
  )?.user;
  if(!otherUser){
    otherUser=user;
  }
 

  return (
    <NavLink
      to={`/chat/${chat._id}`}
      onClick={()=>dispatch(selectChat(chat._id))}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 hover:bg-accent transition
        ${isActive ? "bg-accent" : ""}`
      }
    >
      <Avatar>
        <AvatarFallback>
          {otherUser?.userName?.[0] || "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {otherUser?.userName || "Unknown"}
        </p>

        <p className="text-sm text-muted-foreground truncate">
          {chat?.lastMessage || "No messages yet"}
        </p>
      </div>

      {chat?.unread > 0 && (
        <Badge variant="default">{chat.unread}</Badge>
      )}
    </NavLink>
  );
}