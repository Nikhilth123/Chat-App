import { MessageBubble } from "./MessageBubble.tsx"

export function MessagesContainer() {

  const messages = [
    { id: 1, text: "Hello bro", sender: "other" },
    { id: 2, text: "Hi bro", sender: "me" },
    { id: 3, text: "How are you?", sender: "other" },
    { id: 4, text: "Fine", sender: "me" }
  ]

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg}/>
      ))}

    </div>
  )
}