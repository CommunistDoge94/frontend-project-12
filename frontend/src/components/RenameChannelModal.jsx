import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { closeModal } from '../slices/modalSlice';
import * as Yup from 'yup';

const RenameChannelModal = ({ channelId, currentName }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('min3Chars'))
      .max(20, t('max20Chars'))
      .required(t('required')),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate({ name });
      
      await axios.patch(`/api/v1/channels/${channelId}`, 
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(t('channelRenamed'));
      dispatch(closeModal());
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    setName(currentName);
    setError('');
  };

  return (
    <Modal show={!!channelId} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="channelName">
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!error}
              autoFocus
            />
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button variant="primary" type="submit">
            {t('rename')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RenameChannelModal;