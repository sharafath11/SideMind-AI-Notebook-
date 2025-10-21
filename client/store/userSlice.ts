import { IUser } from "@/types/userTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: IUser = {
  userId: null,
  name: null,
  email: null,

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.userId = null;
      state.name = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
