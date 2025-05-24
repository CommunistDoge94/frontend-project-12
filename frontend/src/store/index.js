import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../slices/chatSlice';
import modalReducer from '../slices/modalSlice';

const store = configureStore({
  reducer: {
    chat: chatReducer,
    modal: modalReducer,
  },
});

export default store;
