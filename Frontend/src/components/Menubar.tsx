import type { JSX } from "react";
import { NavLink } from "react-router-dom";
import {
  MessageCircle,
  Settings,
  Users,
  Phone,
  Home,
  LogOut,
  Video,
  User
} from "lucide-react";

export function MenuBar(): JSX.Element {

  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors
     ${isActive 
       ? "bg-accent text-foreground" 
       : "text-muted-foreground hover:bg-accent hover:text-foreground"
     }`;

  return (
    <div className="flex flex-col items-center w-20 h-screen border-r bg-background py-4">

      {/* TOP SECTION */}
      <div className="flex flex-col gap-6">

        <NavLink to="/" className={menuClass}>
          <Home size={22} />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink to="/chat" className={menuClass}>
          <MessageCircle size={22} />
          <span className="text-xs">Chats</span>
        </NavLink>

        <NavLink to="/call" className={menuClass}>
          <Phone size={22} />
          <span className="text-xs">Calls</span>
        </NavLink>

        <NavLink to="/videocall" className={menuClass}>
          <Video size={22} />
          <span className="text-xs">Video</span>
        </NavLink>

        <NavLink to="/groupchat" className={menuClass}>
          <Users size={22} />
          <span className="text-xs">Groups</span>
        </NavLink>

        <NavLink to="/profile" className={menuClass}>
          <User size={22} />
          <span className="text-xs">Profile</span>
        </NavLink>

      </div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-col gap-6 mt-auto">

        <NavLink to="/settings" className={menuClass}>
          <Settings size={22} />
          <span className="text-xs">Settings</span>
        </NavLink>

        <NavLink to="/logout" className={menuClass}>
          <LogOut size={22} />
          <span className="text-xs">Logout</span>
        </NavLink>

      </div>

    </div>
  );
}