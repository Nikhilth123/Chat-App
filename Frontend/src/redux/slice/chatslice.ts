import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface User{
  _id:string,
  name:string,
  userName:string,
  profilepic?:string,
  email:string,
}

interface Chat {
  _id: string;
  participants:{
    user:User,
    status:string,
  }[],
  lastMessage?: string;
}

interface ChatState {
  chats: Chat[];
  selectedChat: string;
}

const initialState: ChatState = {
  chats: [],
  selectedChat:"",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },

    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload); 
    },

    selectChat: (state, action: PayloadAction<string>) => {
      console.log("Selecting chat with ID:", action.payload);
      console.log("Current selected chat before update:", state.selectedChat);
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