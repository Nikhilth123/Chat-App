import React from 'react'
import { Outlet } from 'react-router-dom'
import {ChatList} from '../components/ChatList'
function ChatListLayout(): React.ReactElement {
  return (
    <div className='flex flex-row min-h-screen'>
    <ChatList></ChatList>   
    <div className='flex-1'>
        <Outlet></Outlet>
    </div>
    </div>
  )
}

export { ChatListLayout}