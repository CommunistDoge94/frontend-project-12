import React from 'react';

const MessageItem = ({ message }) => (
  <div key={message.id} className="mb-2">
    <b>{message.username}: </b>
    <span>{message.body || message.text}</span>
  </div>
);

export default MessageItem;