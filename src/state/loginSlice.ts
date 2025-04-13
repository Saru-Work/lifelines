import { createSlice } from "@reduxjs/toolkit";

interface LoginState {
  isOpen: boolean;
}
const initialState: LoginState = {
  isOpen: false,
};
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    changeState: (state, action) => {
      if (action.payload) {
        state.isOpen = false;
      } else {
        state.isOpen = true;
      }
    },
  },
});
export const { changeState } = loginSlice.actions;
export default loginSlice.reducer;
