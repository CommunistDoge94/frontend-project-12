import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { connectSocket, disconnectSocket, getSocket } from '../utils/socket';

export const fetchInitialData = createAsyncThunk(
  'chat/fetchInitialData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        channels: response.data.channels || [],
        messages: response.data.messages || [],
        currentChannelId: response.data.currentChannelId || null,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Network error');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ body, channelId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        '/api/v1/messages',
        { body, channelId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Network error');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: null,
    loading: false,
    error: null,
    socketConnected: false,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.channels;
        state.messages = action.payload.messages;
        state.currentChannelId = action.payload.currentChannelId;
        state.error = null;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  addMessage,
  setSocketConnected,
  setCurrentChannelId,
  setError,
} = chatSlice.actions;

export const initializeSocket = () => (dispatch, getState) => {
  const token = getState().auth.token;
  const socket = connectSocket(token);

  socket.off('connect');
  socket.off('disconnect');
  socket.off('newMessage');
  socket.off('connect_error');

  socket.on('connect', () => {
    dispatch(setSocketConnected(true));
  });

  socket.on('disconnect', () => {
    dispatch(setSocketConnected(false));
  });

  socket.on('newMessage', (message) => {
    dispatch(addMessage(message));
  });

  socket.on('connect_error', (err) => {
    dispatch(setSocketConnected(false));
    dispatch(setError(err.message));
  });
};

export const closeSocket = () => () => {
  disconnectSocket();
};

export default chatSlice.reducer;
