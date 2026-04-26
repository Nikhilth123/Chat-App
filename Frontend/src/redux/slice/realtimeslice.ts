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
    // ✅ REPLACE FULL LIST (IMPORTANT CHANGE)
    setTyping: (
      state,
      action: PayloadAction<{ chatId: string; users: string[] }>
    ) => {
      const { chatId, users } = action.payload;

      state.typingUsers[chatId] = users;
    },

    // ✅ (optional) clear when leaving chat
    clearTyping: (state, action: PayloadAction<{ chatId: string }>) => {
      const { chatId } = action.payload;
      delete state.typingUsers[chatId];
    },

    // ✅ unchanged
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setTyping, clearTyping, setOnlineUsers } =
  realtimeSlice.actions;

export default realtimeSlice.reducer;