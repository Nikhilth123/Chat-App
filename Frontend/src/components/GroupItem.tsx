import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxhooks";
import {selectChat} from "@/redux/slice/chatslice"
import { useDispatch } from "react-redux";
export default function GroupItem({ group }: any) { 
  const user = useAppSelector((state) => state.auth.user);
// if(!user)return <div>Loading...</div>
console.log("g=",group);
const dispatch=useDispatch();
  return (
    <NavLink
      to={`/groupchat/${group._id}`}
      onClick={()=>dispatch(selectChat(group._id))}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 hover:bg-accent transition
        ${isActive ? "bg-accent" : ""}`
      }
    >
      <Avatar>
        <AvatarFallback>
          {group.groupName[0]|| "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {group.groupName||"Unknown"}
        </p>

     
      </div>

      {group?.unread > 0 && (
        <Badge variant="default">{group.unread}</Badge>
      )}
    </NavLink>
  );
}