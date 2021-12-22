import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  user: {
    email: "",
    name: "",
    role: "",
    isAdmin: false,
    isLoggedIn: false,
    userAddress: "",
    walletAddress: "",
    otp: false,
    leave: false,
    emailGrant: false,
  },
  token: {
    accessToken: "",
    expireTime: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state, action) {
      state.user = initialUserState.user;
      state.token = initialUserState.token;
    },
    replaceUserInfo(state, action) {
      state.user = { ...state.user, ...action.payload.user };
      state.token = { ...state.token, ...action.payload.token };
    },
  },
});

export const userAction = userSlice.actions;
export default userSlice;
