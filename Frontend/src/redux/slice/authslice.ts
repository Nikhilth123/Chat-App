import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  userName:string;
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<User>
    ) => {
        console.log("OLD USER:", state.user);
  console.log("NEW USER:", action.payload);
      state.user = action.payload;

    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;