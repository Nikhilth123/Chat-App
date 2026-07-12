import { useParams } from "react-router-dom"
import { GroupMessageHeader } from "../components/message/GroupMessageHeader"
import { MessagesContainer } from "../components/message/MessageContainer"
import { MessageInput } from "../components/message/MessageInput"

export function GroupLayout() {

  const { id } = useParams();
console.log('in group layout baba');
  return (
    <div className="flex flex-col h-full w-full">

      <GroupMessageHeader groupId={id} />

      <MessagesContainer />

      <MessageInput />

    </div>
  )
}

//singharya2195@gmail.com