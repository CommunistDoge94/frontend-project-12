import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      if (!Array.isArray(state.messages)) {
        state.messages = [];
      }
      state.messages.push(action.payload);
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    setActiveChannel: (state, action) => {
      state.activeChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.loading = false;
        const channels = Array.isArray(action.payload.channels) ? action.payload.channels : [];
        const hasGeneral = channels.some((ch) => ch.name === 'General');
        if (!hasGeneral) {
          channels.unshift({ id: 0, name: 'General' });
        }
      
        state.channels = channels;
        state.messages = Array.isArray(action.payload.messages) ? action.payload.messages : [];
      })
  },
});

export const { addMessage, addChannel, setActiveChannel } = chatSlice.actions;
export default chatSlice.reducer;
export { fetchChatData };
