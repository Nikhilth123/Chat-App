import React from "react";
import { Outlet } from "react-router-dom";
import {ChatHeader} from '../components/ChatHeader'
import {ChatInput} from '../components/ChatInput'
function ChatLayout(): React.ReactElement {
  return (  
    <div className="flex flex-col min-h-screen">
        <ChatHeader></ChatHeader>
        <div className="flex-1">
            <Outlet></Outlet>
        </div>
        <ChatInput></ChatInput>
    </div>
  )
}
export { ChatLayout}