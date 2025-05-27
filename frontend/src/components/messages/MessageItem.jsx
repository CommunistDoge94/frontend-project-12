import React from 'react';
import { filterProfanity } from '../../utils/profanityFilter';

const MessageItem = ({ message }) => {
  const safeBody = filterProfanity(String(message.body || message.text || ''));

  return (
    <div className="mb-2">
      <b>
        {message.username}
        :
        {' '}
      </b>
      <span>{safeBody}</span>
    </div>
  );
};

export default MessageItem;
