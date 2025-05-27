import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socket, { connectSocket } from '../socket';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice';
import { addMessage, removeMessagesByChannelId } from '../slices/messagesSlice';

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket();

    const handleNewMessage = (message) => dispatch(addMessage(message));
    const handleNewChannel = (channel) => dispatch(addChannel({
      id: Number(channel.id),
      name: channel.name,
      removable: channel.removable,
      isOwned: false
    }));
    const handleRemoveChannel = ({ id }) => {
      dispatch(removeChannel(id));
      dispatch(removeMessagesByChannelId(id));
    };
    const handleRenameChannel = (channel) => dispatch(renameChannel({
      id: Number(channel.id),
      name: channel.name
    }));

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
    };
  }, [dispatch]);
};

export default useSocket;
