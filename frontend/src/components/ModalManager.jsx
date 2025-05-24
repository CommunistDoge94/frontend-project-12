import React from 'react';
import { useSelector } from 'react-redux';
import AddChannelModal from './AddChannelModal';
import RemoveChannelModal from './RemoveChannelModal';
import RenameChannelModal from './RenameChannelModal';

const ModalManager = () => {
  const type = useSelector((state) => state.modal.type);
  console.log('ModalManager type=', type);

  if (type === 'addChannel') return <AddChannelModal />;
  if (type === 'removeChannel') return <RemoveChannelModal />;
  if (type === 'renameChannel') return <RenameChannelModal />;
  return null;
};

export default ModalManager;