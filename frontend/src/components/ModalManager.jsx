import React from 'react';
import { useSelector } from 'react-redux';
import AddChannelModal from './modals/AddChannelModal';
import RemoveChannelModal from './modals/RemoveChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';

const ModalManager = () => {
  const { type, extra } = useSelector((state) => state.modal);
  
  if (type === 'addChannel') return <AddChannelModal />;
  if (type === 'removeChannel') return <RemoveChannelModal />;
  if (type === 'renameChannel') return (
    <RenameChannelModal 
      channelId={extra.channelId}
      currentName={extra.channelName}
    />
  );
  return null;
};

export default ModalManager;