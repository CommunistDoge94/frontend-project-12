import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiRoutes } from '../api/api'
import { getApi } from '../api/createApi'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await getApi(apiRoutes.getChannels(), { Authorization: `Bearer ${token}` })

      return response
    }
    catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    activeChannelId: 1,
    loading: false,
    error: null,
  },
  reducers: {
    addChannel: (state, action) => {
      const newChannel = action.payload
      const existsById = state.items.some(c => c.id === newChannel.id)
      const existsByName = state.items.some(
        c => c.name.toLowerCase() === newChannel.name.toLowerCase(),
      )
      if (!existsById && !existsByName) {
        state.items.push(newChannel)
      }

      if (newChannel.isOwned) {
        state.activeChannelId = newChannel.id
      }
    },
    setActiveChannel: (state, action) => {
      state.activeChannelId = Number(action.payload)
    },
    removeChannel: (state, action) => {
      const id = Number(action.payload)
      state.items = state.items.filter(ch => ch.id !== id)
      if (state.activeChannelId === id) {
        const general = state.items.find(ch => ch.name === 'General')
        state.activeChannelId = general ? general.id : 1
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload
      const channel = state.items.find(c => c.id === Number(id))
      if (channel) {
        channel.name = name
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.map(ch => ({
          id: Number(ch.id),
          name: ch.name,
          removable: ch.removable,
        }))

        if (!state.items.some(ch => ch.name === 'general')) {
          state.items.unshift({
            id: 1,
            name: 'general',
            removable: false,
          })
        }
      })
  },
})

export const selectChannels = state => state.channels.items
export const selectActiveChannelId = state => state.channels.activeChannelId
export const {
  addChannel, setActiveChannel, removeChannel, renameChannel,
} = channelsSlice.actions
export default channelsSlice.reducer
