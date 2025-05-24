import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/data', {
        headers: { Authorization: `Bearer ${token}` },
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
    activeChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      if (!Array.isArray(state.messages)) state.messages = [];
      state.messages.push(action.payload);
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
      state.activeChannelId = action.payload.id;
    },
    setActiveChannel: (state, action) => {
      state.activeChannelId = action.payload;
    },
    removeChannel: (state, action) => {
      const id = action.payload;
      state.channels = state.channels.filter(ch => ch.id !== id);
      state.messages = state.messages.filter(msg => msg.channelId !== id);
      if (state.activeChannelId === id) {
        const general = state.channels.find(ch => ch.name === 'General');
        state.activeChannelId = general ? general.id : null;
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const ch = state.channels.find(c => c.id === id);
      if (ch) ch.name = name;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChatData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.loading = false;
        let channels = Array.isArray(action.payload.channels) ? action.payload.channels : [];
        const hasGeneral = channels.some(ch => ch.name === 'General');
        if (!hasGeneral) {
          channels.unshift({ id: 0, name: 'General', removable: false });
        }
        state.channels = channels;
        state.messages = Array.isArray(action.payload.messages) ? action.payload.messages : [];
      });
  },
});

export const { addMessage, addChannel, setActiveChannel, removeChannel, renameChannel } = chatSlice.actions;
export default chatSlice.reducer;
