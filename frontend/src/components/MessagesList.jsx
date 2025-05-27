import React from 'react';
import { useSelector } from 'react-redux';
import MessageItem from './MessageItem';
import { selectMessages } from '../slices/messagesSlice';
import { selectActiveChannelId } from '../slices/channelsSlice';

const MessagesList = () => {
  const messages = useSelector(selectMessages);
  const activeChannelId = useSelector(selectActiveChannelId);
  const filteredMessages = messages.filter((msg) => msg.channelId === activeChannelId);

  return (
    <div className="flex-grow-1 overflow-auto mb-3">
      {filteredMessages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessagesList;