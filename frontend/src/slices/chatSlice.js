import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const [channelsRes, messagesRes] = await Promise.all([
        axios.get('/api/v1/channels', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/v1/messages', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      return {
        channels: channelsRes.data,
        messages: messagesRes.data
      };
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
    const channel = {
      ...action.payload,
      name: action.payload.name.toLowerCase()
    };
    
    if (!state.channels.some(c => c.name === channel.name)) {
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
        state.error = null;

        const channels = action.payload.channels.map(ch => ({
          id: Number(ch.id),
          name: ch.name.toLowerCase(),
          removable: ch.removable
        }));

        if (!channels.some(ch => ch.name === 'general')) {
          channels.unshift({ id: 1, name: 'general', removable: false });
        }

        state.channels = channels;
        state.activeChannelId = state.activeChannelId === 1 ? 1 : channels[0]?.id;
        state.messages = action.payload.messages.map(msg => ({
          ...msg,
          channelId: Number(msg.channelId),
          id: Number(msg.id)
        }));
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