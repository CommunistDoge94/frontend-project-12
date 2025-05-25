import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannel } from '../slices/chatSlice';
import ChannelItem from './ChannelItem';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { channels, activeChannelId } = useSelector((state) => state.chat);
  
  useEffect(() => {
    if (!activeChannelId && channels.length > 0) {
      const general = channels.find((ch) => ch.name === 'General');
      if (general) dispatch(setActiveChannel(general.id));
    }
  }, [channels, activeChannelId, dispatch]);

  return (
    <ul className="list-group flex-grow-1 overflow-auto">
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