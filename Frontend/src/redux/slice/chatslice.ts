import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Chat {
  _id: string;
  users: any[];
  lastMessage?: string;
}

interface ChatState {
  user: any;
  chats: Chat[];
  selectedChat: Chat | null;
}

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
  user: undefined
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },

    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload); // new chat on top
    },

    selectChat: (state, action: PayloadAction<Chat>) => {
      state.selectedChat = action.payload;
    },

    updateLastMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: string }>
    ) => {
      const chat = state.chats.find(
        (c) => c._id === action.payload.chatId
      );
      if (chat) {
        chat.lastMessage = action.payload.message;
      }
    },
  },
});

export const {
  setChats,
  addChat,
  selectChat,
  updateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;