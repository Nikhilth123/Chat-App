import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  chatId: string;
  sender: any;
  content: string;
  status: string[];
  createdAt: string;
  updatedAt: string;
}

interface MessageState {
  messages: Record<string, Message[]>; 
 
}

const initialState: MessageState = {
  messages: {},
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>
    ) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chatId;

      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }

      state.messages[chatId].push(action.payload);
    },

    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
  },
});

export const { setMessages, addMessage, clearMessages } =
  messageSlice.actions;

export default messageSlice.reducer;