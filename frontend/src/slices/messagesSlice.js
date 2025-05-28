import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiRoutes } from '../api'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(apiRoutes.getMessages(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.items.push(action.payload)
    },
    removeMessagesByChannelId: (state, action) => {
      const channelId = Number(action.payload)
      state.items = state.items.filter(msg => msg.channelId !== channelId)
    },
  },
  extraReducers: (builder) => {
    (builder)
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
  },
})

export const { addMessage, removeMessagesByChannelId } = messagesSlice.actions
export const selectMessages = state => state.messages.items
export default messagesSlice.reducer
