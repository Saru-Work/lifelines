import { createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { UserInfo } from "firebase/auth";
const initialState: User | null = {
  uid: "", // Unique ID
  email: "", // User's email
  displayName: "", // User's name
  photoURL: "", // Profile picture
  emailVerified: false, // Is email verified
  phoneNumber: "", // If phone number is used
  providerData: [] as UserInfo[], // Auth providers info
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateDisplayName: (state, action) => {
      state.displayName = action.payload.displayName;
    },
    addUser: (state, action) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
    },
    removeUser: (state) => {
      state.email = "";
      state.uid = "";
    },
  },
});

export const { addUser, removeUser, updateDisplayName } = userSlice.actions;
export default userSlice.reducer;
