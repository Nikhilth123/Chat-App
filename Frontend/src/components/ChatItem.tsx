import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NavLink } from "react-router-dom"

export default function ChatItem({ chat }: any) {

  return (
    <NavLink
      to={`/chat/${chat.id}`}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 hover:bg-accent transition
        ${isActive ? "bg-accent" : ""}`
      }
    >

      <Avatar>
        <AvatarFallback>
          {chat.name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{chat.name}</p>
        <p className="text-sm text-muted-foreground truncate">
          {chat.lastMessage}
        </p>
      </div>

      {chat.unread > 0 && (
        <Badge variant="default">
          {chat.unread}
        </Badge>
      )}

    </NavLink>
  )
}