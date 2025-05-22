import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInitialData = createAsyncThunk(
  'chat/fetchData',
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
      return rejectWithValue(err.response?.data || 'Network error');
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
  },
  reducers: {},
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
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
