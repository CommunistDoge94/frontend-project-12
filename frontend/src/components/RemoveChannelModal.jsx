import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { closeModal } from '../slices/modalSlice';
import { removeChannel } from '../slices/chatSlice';
import socket from '../socket';
import { toast } from 'react-toastify';

const RemoveChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channelId } = useSelector((state) => state.modal.extra);

  const handleClose = () => dispatch(closeModal());
  const handleRemove = () => {
    dispatch(removeChannel(channelId));
    socket.emit('removeChannel', { id: channelId });
    toast.success(t('toast.channelDeleted'));
    dispatch(closeModal());
  };

  return (
    <Modal show centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('chatPage.removeConfirmation')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('button.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          {t('button.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
