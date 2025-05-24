import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice.js';
import socket from '../socket.js';

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const { channelId } = useSelector((state) => state.modal.extra);

  const handleClose = () => dispatch(closeModal());

  const handleRemove = () => {
    socket.emit('removeChannel', { id: channelId }, () => {
      dispatch(closeModal());
    });
  };

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>Вы уверены, что хотите удалить канал?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Отменить</Button>
        <Button variant="danger" onClick={handleRemove}>Удалить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
