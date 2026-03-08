
export function MessageBubble({ message }:any) {

  const isMe = message.sender === "me"

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>

      <div
        className={`px-4 py-2 rounded-lg max-w-xs 
        ${isMe ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
      >
        {message.text}
      </div>

    </div>
  )
}