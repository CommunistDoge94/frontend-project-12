import React from 'react';
import { useSelector } from 'react-redux';
import AddChannelModal from './AddChannelModal.jsx';
import RemoveChannelModal from './RemoveChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';

const mapping = {
  addChannel: AddChannelModal,
  removeChannel: RemoveChannelModal,
  renameChannel: RenameChannelModal,
};

const ModalManager = () => {
  const { type } = useSelector((state) => state.modal);
  if (!type) return null;

  const Component = mapping[type];
  return <Component />;
};

export default ModalManager;
