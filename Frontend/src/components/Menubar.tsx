import type { JSX } from "react"
import { Link } from "react-router-dom"

export function MenuBar():JSX.Element{ 
    return(
    <div className="flex flex-col justify-between items-center border-r-2 border-gray-300 w-20 py-4 ">
        <Link to='/'>Home</Link>
        <Link to='/chat'>Login</Link>
        <Link to='/call'>Signup</Link>
        <Link to='/profile'>Profile</Link>
        <Link to='/settings'>Settings</Link>
        <Link to='/logout'>Logout</Link>
        <Link to='/videocall'>videocall</Link>
        <Link to='/groupchat'>GroupChat</Link>
    </div>
    )
}