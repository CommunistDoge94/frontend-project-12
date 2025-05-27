import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messagesSlice';

export const useMessages = () => {
  const dispatch = useDispatch();
  
  return {
    addMessage: (message) => dispatch(addMessage(message))
  };
};