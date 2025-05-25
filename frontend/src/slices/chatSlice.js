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
    activeChannelId: 1,
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addChannel: (state, action) => {
      const channel = action.payload;
      if (!state.channels.some(c => c.id === channel.id)) {
        state.channels.push(channel);
      }
      state.activeChannelId = channel.id;
    },
    setActiveChannel: (state, action) => {
      state.activeChannelId = Number(action.payload);
    },
    removeChannel: (state, action) => {
      const id = Number(action.payload);
      state.channels = state.channels.filter(ch => ch.id !== id);
      state.messages = state.messages.filter(msg => msg.channelId !== id);
      if (state.activeChannelId === id) {
        const general = state.channels.find(ch => ch.name === 'General');
        state.activeChannelId = general ? general.id : 1;
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find(c => c.id === Number(id));
      if (channel) {
        channel.name = name;
      }
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
        const serverChannels = Array.isArray(action.payload.channels)
          ? action.payload.channels.map(ch => ({
              id: Number(ch.id),
              name: ch.name,
              removable: ch.removable !== undefined ? ch.removable : true
            }))
          : [];

        const hasGeneral = serverChannels.some(ch => ch.name === 'General');
        let channels = serverChannels;
        if (!hasGeneral) {
          channels = [{ id: 1, name: 'General', removable: false }, ...serverChannels];
        }

        let activeChannelId = state.activeChannelId;
        if (!channels.some(ch => ch.id === activeChannelId)) {
          activeChannelId = channels[0]?.id || 1;
        }

        state.channels = channels;
        state.activeChannelId = activeChannelId;
        state.messages = Array.isArray(action.payload.messages)
          ? action.payload.messages.map(msg => ({
              ...msg,
              channelId: Number(msg.channelId),
              id: Number(msg.id)
            }))
          : [];
      });
  },
});

export const {
  addMessage,
  addChannel,
  setActiveChannel,
  removeChannel,
  renameChannel,
} = chatSlice.actions;

export default chatSlice.reducer;