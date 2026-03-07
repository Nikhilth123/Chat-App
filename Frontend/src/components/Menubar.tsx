import type { JSX } from "react"
import { Link } from "react-router-dom"

export function MenuBar():JSX.Element{ 
    return(
    <div className="flex flex-col space-y-10 items-center border-r-2 border-gray-300 w-15 h-screen mx-2">
        <Link to='/'>Home</Link>
        <Link to='/chat'>Chat</Link>
        <Link to='/call'>Call</Link>
        <Link to='/profile'>Profile</Link>
        <Link to='/settings'>Settings</Link>
        <Link to='/logout'>Logout</Link>
        <Link to='/videocall'>videocall</Link>
        <Link to='/groupchat'>GroupChat</Link>
    </div>
    )
}