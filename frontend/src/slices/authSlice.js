import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

const initialState = {
  username: username || null,
  token: token || null,
  isLoggedIn: Boolean(token),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.username = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
