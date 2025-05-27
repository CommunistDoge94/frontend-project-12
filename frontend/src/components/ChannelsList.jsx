import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChannelItem from './ChannelItem';
import { setActiveChannel } from '../slices/chatSlice';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { channels, activeChannelId } = useSelector((state) => state.chat);

  return (
    <ul 
      className="list-group flex-grow-1 overflow-auto" 
      role="list" 
      aria-label="Список каналов"
    >
      {channels.map((channel) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isActive={channel.id === activeChannelId}
          onClick={() => dispatch(setActiveChannel(channel.id))}
        />
      ))}
    </ul>
  );
};

export default ChannelsList;