import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { closeModal } from '../slices/modalSlice.js';
import { removeChannel } from '../slices/chatSlice.js';
import socket from '../socket.js';

const RemoveChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channelId } = useSelector((state) => state.modal.extra);

  const handleClose = () => dispatch(closeModal());

  const handleRemove = () => {
    dispatch(removeChannel(channelId));
    socket.emit('removeChannel', { id: channelId });
    dispatch(closeModal());
  };

  return (
    <Modal show onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('removeConfirmation')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>{t('cancel')}</Button>
        <Button variant="danger" onClick={handleRemove}>{t('remove')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;