import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiSlice } from '../api/createApi'

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('token')
    if (!token) return rejectWithValue('No token')

    try {
      await dispatch(apiSlice.endpoints.getChannels.initiate()).unwrap()
      return {
        token,
        username: localStorage.getItem('username'),
      }
    }
    catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      return rejectWithValue(error)
    }
  },
)

const initialState = {
  username: null,
  token: null,
  isLoggedIn: false,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.username = action.payload.username
      state.token = action.payload.token
      state.isLoggedIn = true
      state.initialized = true
    },
    logout(state) {
      state.username = null
      state.token = null
      state.isLoggedIn = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.username = action.payload.username
        state.isLoggedIn = true
        state.initialized = true
      })
      .addCase(checkAuth.rejected, (state) => {
        state.token = null
        state.username = null
        state.isLoggedIn = false
        state.initialized = true
      })
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
