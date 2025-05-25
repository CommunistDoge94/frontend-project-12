import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { closeModal } from '../slices/modalSlice';
import * as Yup from 'yup';
import { filterProfanity } from '../utils/profanityFilter';

const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');
  const show = useSelector((state) => state.modal.type === 'addChannel');
  const token = localStorage.getItem('token');

  const schema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, t('min3Chars'))
      .max(20, t('max20Chars'))
      .required(t('required')),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate({ channelName });
      
      const filteredName = filterProfanity(channelName.trim());
      if (!filteredName) {
        throw new Error(t('channel.emptyNameError'));
      }

      const response = await axios.post(
        '/api/v1/channels',
        { name: filteredName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.id) {
        toast.success(t('channelCreated'));
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    setChannelName('');
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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
            {t('confirm')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddChannelModal;