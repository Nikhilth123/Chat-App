import   React from "react";
import { Outlet, useParams } from "react-router-dom";
import { ChatList } from "../components/ChatList";

function ChatListLayout(): React.ReactElement {

  const { id } = useParams();

  return (
    <div className="flex h-full w-full">

      {/* Chat List */}
      <div
        className={`
        ${id ? "hidden md:block" : "block"}
        w-full md:w-[320px] border-r
        `}
      >
        <ChatList />
      </div>

      {/* Chat Window */}
      <div
        className={`
        ${id ? "block" : "hidden md:block"}
        flex-1
        `}
      >
        <Outlet />
      </div>

    </div>
  );
}

export { ChatListLayout };