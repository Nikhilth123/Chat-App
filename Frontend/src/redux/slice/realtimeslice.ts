import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RealtimeState {
  typingUsers: Record<string, string[]>;
  onlineUsers: string[];
}

const initialState: RealtimeState = {
  typingUsers: {},
  onlineUsers: [],
};

const realtimeSlice = createSlice({
  name: "realtime",
  initialState,
  reducers: {
    setTyping: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) => {
      const { chatId, userId } = action.payload;

      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }

      if (!state.typingUsers[chatId].includes(userId)) {
        state.typingUsers[chatId].push(userId);
      }
    },

    removeTyping: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) => {
      const { chatId, userId } = action.payload;

      state.typingUsers[chatId] =
        state.typingUsers[chatId]?.filter((id) => id !== userId) || [];
    },

    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setTyping, removeTyping, setOnlineUsers } =
  realtimeSlice.actions;

export default realtimeSlice.reducer;