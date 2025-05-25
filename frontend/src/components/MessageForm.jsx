import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const MessageForm = () => {
  const { t } = useTranslation();
  const [messageText, setMessageText] = useState('');
  const activeChannelId = useSelector((state) => state.chat.activeChannelId);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    try {
      await axios.post(
        '/api/v1/messages',
        { body: messageText, channelId: activeChannelId, username },
        { headers: { Authorization: `Bearer ${token}` } },
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
