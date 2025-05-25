import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import socket from '../socket';
import { toast } from 'react-toastify';

const RenameChannelModal = ({ channelId, currentName, onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(currentName);
  const channels = useSelector((state) => state.chat.channels);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!channels.some((c) => c.name === name && c.id !== channelId)) {
      socket.emit('renameChannel', { id: channelId, name });
      toast.success(t('channelRenamed'));
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <h5>{t('renameChannel')}</h5>
      <input value={name} onChange={(e) => setName(e.target.value)} autoFocus className="form-control mb-3" />
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          {t('cancel')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('rename')}
        </button>
      </div>
    </form>
  );
};

export default RenameChannelModal;