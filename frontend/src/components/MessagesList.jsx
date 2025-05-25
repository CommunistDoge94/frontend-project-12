import React from 'react';
import { useSelector } from 'react-redux';
import MessageItem from './MessageItem';

const MessagesList = () => {
  const { messages, activeChannelId } = useSelector((state) => state.chat);
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