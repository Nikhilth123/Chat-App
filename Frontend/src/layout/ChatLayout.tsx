import { useParams } from "react-router-dom"
import { ChatHeader } from "../components/message/MessageHeader"
import { MessagesContainer } from "../components/message/MessageContainer"
import { MessageInput } from "../components/message/MessageInput"

export function ChatLayout() {

  const { id } = useParams();

  return (
    <div className="flex flex-col h-full w-full">

      <ChatHeader chatId={id} />

      <MessagesContainer />

      <MessageInput />

    </div>
  )
}

//singharya2195@gmail.com