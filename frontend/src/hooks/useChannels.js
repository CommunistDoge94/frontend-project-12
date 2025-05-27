import { useDispatch } from 'react-redux';
import {
  addChannel, removeChannel, renameChannel, setActiveChannel,
} from '../slices/channelsSlice';

export const useChannels = () => {
  const dispatch = useDispatch();

  return {
    addChannel: (channel) => dispatch(addChannel(channel)),
    removeChannel: (id) => dispatch(removeChannel(id)),
    renameChannel: (id, name) => dispatch(renameChannel({ id, name })),
    setActiveChannel: (id) => dispatch(setActiveChannel(id)),
  };
};
