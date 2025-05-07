import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: any;
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
    updateUserConfig: (
      state,
      action: PayloadAction<{
        displayName: string;
        photoURL: any;
      }>
    ) => {
      if (state) {
        state.displayName = action.payload.displayName;
        state.photoURL = action.payload.photoURL;
      }
    },
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state) => {
      return initialState;
    },
  },
});

export const { addUser, removeUser, updateUserConfig } = userSlice.actions;
export default userSlice.reducer;
