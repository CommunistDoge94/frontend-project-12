import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import channelsReducer from '../slices/channelsSlice'
import messagesReducer from '../slices/messagesSlice'
import modalReducer from '../slices/modalSlice'
import { apiSlice } from '../api/createApi'

export default configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
