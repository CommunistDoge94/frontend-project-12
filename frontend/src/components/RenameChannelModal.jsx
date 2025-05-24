import React, { useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { closeModal } from '../slices/modalSlice.js';
import { renameChannel } from '../slices/chatSlice.js';
import socket from '../socket.js';

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const { channelId, channelName } = useSelector((state) => state.modal.extra);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: { name: channelName },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов').required('Обязательное поле'),
    }),
    onSubmit: ({ name }) => {
      dispatch(renameChannel({ id: channelId, name }));
      socket.emit('renameChannel', { id: channelId, name });
      dispatch(closeModal());
    },
  });

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              name="name"
              innerRef={inputRef}
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => dispatch(closeModal())}>
              Отменить
            </Button>
            <Button type="submit">
              Переименовать
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;