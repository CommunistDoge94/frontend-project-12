import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiSlice } from '../api/createApi'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await dispatch(apiSlice.endpoints.getMessages.initiate()).unwrap()
      return response
    }
    catch (error) {
      return rejectWithValue(error.message)
    }
  }
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
    builder
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
