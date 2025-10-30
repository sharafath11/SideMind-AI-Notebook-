import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import subjectsReducer from "./subjectSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    subjects:subjectsReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
