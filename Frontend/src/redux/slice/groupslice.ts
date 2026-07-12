import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  userName: string;
}

interface Participant {
  user: User;
  status: string;
}

export interface Group {
  _id: string;
  groupName: string;
  participants: Participant[];
  groupAdmin: User[];
}

interface GroupState {
  groups: Group[];
  selectedGroup: string | null;
}

const initialState: GroupState = {
  groups: [],
  selectedGroup: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
              console.log("OLD group:", state.groups);
  console.log("NEW group:", action.payload);
      state.groups = action.payload;
    },

    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.unshift(action.payload);
    },

    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex(
        (group) => group._id === action.payload._id
      );

      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },

    removeGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(
        (group) => group._id !== action.payload
      );

      if (state.selectedGroup === action.payload) {
        state.selectedGroup = null;
      }
    },

    selectGroup: (state, action: PayloadAction<string | null>) => {
      state.selectedGroup = action.payload;
    },

    clearGroups: (state) => {
      state.groups = [];
      state.selectedGroup = null;
    },
  },
});

export const {
  setGroups,
  addGroup,
  updateGroup,
  removeGroup,
  selectGroup,
  clearGroups,
} = groupSlice.actions;

export default groupSlice.reducer;