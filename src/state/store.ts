import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice";
import userReducer from "./userSlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
