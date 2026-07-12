import   React from "react";
import { Outlet, useParams } from "react-router-dom";
import GroupList from "@/components/GroupList";

function GroupListLayout(): React.ReactElement {

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
        <GroupList />
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

export { GroupListLayout };