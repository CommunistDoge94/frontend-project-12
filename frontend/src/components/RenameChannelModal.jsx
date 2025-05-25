import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import socket from '../socket';

const RenameChannelModal = ({ channelId, currentName, onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(currentName);
  const channels = useSelector((state) => state.channels.channels);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channels.some((c) => c.name === name && c.id !== channelId)) {
      return;
    }
    socket.emit('renameChannel', { id: channelId, name });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5>{t('renameChannel')}</h5>
      <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <button type="submit">{t('rename')}</button>
      <button type="button" onClick={onClose}>
        {t('cancel')}
      </button>
    </form>
  );
};

export default RenameChannelModal;
