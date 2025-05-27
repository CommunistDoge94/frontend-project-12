import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { renameChannel } from '../../slices/channelsSlice';
import * as Yup from 'yup';
import { filterProfanity } from '../../utils/profanityFilter';
import { useModal } from '../../hooks/useModal';

const RenameChannelModal = ({ channelId, currentName }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('chatPage.chatNameLengthError'))
      .max(20, t('chatPage.chatNameLengthError'))
      .required(t('chatPage.required')),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate({ name });

      const filteredName = filterProfanity(name.trim());
      if (!filteredName) {
        throw new Error(t('channel.emptyNameError'));
      }

      await axios.patch(
        `/api/v1/channels/${channelId}`,
        { name: filteredName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(t('toast.channelRenamed'));
      dispatch(renameChannel({ id: channelId, name: filteredName }));
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleClose = () => {
    closeModal();
    setName(currentName);
    setError('');
  };

  return (
    <Modal show={!!channelId} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="channelName">
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!error}
              autoFocus
              aria-label="Имя канала"
            />
            {error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('buttons.cancel')}
          </Button>
          <Button variant="primary" type="submit">
            {t('buttons.rename')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RenameChannelModal;
