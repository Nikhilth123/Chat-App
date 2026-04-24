import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Message {
  _id: string
  chatId: string
  text: string
  createdAt: string
  senderId: string
  updatedAt: string
}

interface ChatMessages {
  ids: string[]
  entities: Record<string, Message>
  loaded: boolean
  hasMore: boolean
}

interface MessageState {
  byChatId: Record<string, ChatMessages>
}

const initialState: MessageState = {
  byChatId: {}
}

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {

    // ✅ Set messages when fetching from API
    setMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>
    ) => {
      const { chatId, messages } = action.payload

      if (!state.byChatId[chatId]) {
        state.byChatId[chatId] = {
          ids: [],
          entities: {},
          loaded: false,
          hasMore: true
        }
      }

      const chat = state.byChatId[chatId]

      messages.forEach((msg) => {
        if (!chat.entities[msg._id]) {
          chat.ids.push(msg._id)
          chat.entities[msg._id] = msg
        }
      })

      chat.loaded = true
    },

    // ✅ Add single message (socket / send)
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const { chatId, message } = action.payload

      if (!state.byChatId[chatId]) {
        state.byChatId[chatId] = {
          ids: [],
          entities: {},
          loaded: true,
          hasMore: true
        }
      }

      const chat = state.byChatId[chatId]

      // prevent duplicates
      if (!chat.entities[message._id]) {
        chat.ids.push(message._id)
        chat.entities[message._id] = message
      }
    },

    // ✅ Add older messages (pagination - prepend)
    addOlderMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>
    ) => {
      const { chatId, messages } = action.payload

      const chat = state.byChatId[chatId]
      if (!chat) return

      const newIds: string[] = []

      messages.forEach((msg) => {
        if (!chat.entities[msg._id]) {
          newIds.push(msg._id)
          chat.entities[msg._id] = msg
        }
      })

      chat.ids = [...newIds, ...chat.ids]

      if (messages.length === 0) {
        chat.hasMore = false
      }
    },

    // ✅ Clear messages (optional - logout etc.)
    clearMessages: (state) => {
      state.byChatId = {}
    }
  }
})

export const {
  setMessages,
  addMessage,
  addOlderMessages,
  clearMessages
} = messageSlice.actions

export default messageSlice.reducer