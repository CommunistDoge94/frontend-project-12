import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from '../slices/channelsSlice';
import messagesReducer from '../slices/messagesSlice';
import modalReducer from '../slices/modalSlice';
import authReducer from '../slices/authSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
    auth: authReducer,
  },
});