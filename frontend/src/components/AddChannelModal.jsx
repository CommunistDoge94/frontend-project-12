import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addChannel } from '../slices/chatSlice';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const AddChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [channelName, setChannelName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channelName.trim()) {
      dispatch(addChannel({ name: channelName }));
      toast.success(t('channelCreated'));
      setChannelName('');
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="channelName">
            <Form.Label>{t('channelName')}</Form.Label>
            <Form.Control
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {t('cancel')}
          </Button>
          <Button variant="primary" type="submit">
            {t('confirm')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddChannelModal;
