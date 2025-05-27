import React from 'react';
import { useSelector } from 'react-redux';
import ChannelItem from './ChannelItem';

const ChannelsList = () => {
  const { channels } = useSelector((state) => state.chat);

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
