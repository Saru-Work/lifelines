import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

const initialState: User = {
  uid: "",
  email: "",
  displayName: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateDisplayName: (
      state,
      action: PayloadAction<{ displayName: string }>
    ) => {
      if (state) state.displayName = action.payload.displayName;
    },
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state) => {
      return initialState;
    },
  },
});

export const { addUser, removeUser, updateDisplayName } = userSlice.actions;
export default userSlice.reducer;
