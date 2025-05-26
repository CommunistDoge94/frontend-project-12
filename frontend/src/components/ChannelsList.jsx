import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannel } from '../slices/chatSlice';
import ChannelItem from './ChannelItem';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { channels, activeChannelId } = useSelector((state) => state.chat);

  return (
    <ul className="list-group flex-grow-1 overflow-auto" role="list">
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