import { Send } from "lucide-react"
import { useState } from "react"

export function MessageInput() {

  const [message, setMessage] = useState("")

  const sendMessage = () => {
    console.log(message)
    setMessage("")
  }

  return (
    <div className="flex items-center gap-2 p-4 border-t">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-lg"
      />

      <button
        onClick={sendMessage}
        className="p-2 bg-green-500 text-white rounded-lg"
      >
        <Send size={18}/>
      </button>

    </div>
  )
}