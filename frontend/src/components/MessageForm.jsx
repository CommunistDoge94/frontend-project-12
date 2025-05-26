import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { filterProfanity } from '../utils/profanityFilter';

const MessageForm = () => {
  const { t } = useTranslation();
  const [messageText, setMessageText] = useState('');
  const activeChannelId = useSelector((state) => state.chat.activeChannelId);
  const token = localStorage.getItem('token');

  const sendMessage = async (e) => {
    e.preventDefault();
    const rawText = messageText.trim();
    
    if (!rawText) {
      toast.error(t('message.emptyError'));
      return;
    }

    const filteredText = filterProfanity(rawText);
    
    try {
      await axios.post(
        '/api/v1/messages',
        { 
          body: filteredText,
          channelId: activeChannelId,
          username: localStorage.getItem('username')
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessageText('');
    } catch (err) {
      toast.error(t('networkErrorToast'));
    }
  };

  return (
    <form onSubmit={sendMessage} className="d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder={t('enterMessage')}
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary">
        {t('send')}
      </button>
    </form>
  );
};

export default MessageForm;