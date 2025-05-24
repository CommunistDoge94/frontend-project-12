import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import socket from '../socket.js';
import { closeModal } from '../slices/modalSlice.js';

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const { channelId, channelName } = useSelector((state) => state.modal.extra);

  const handleClose = () => dispatch(closeModal());

  const formik = useFormik({
    initialValues: { name: channelName },
    validationSchema: yup.object({
      name: yup.string().required('Обязательное поле'),
    }),
    onSubmit: ({ name }) => {
      socket.emit('renameChannel', { id: channelId, name }, () => {
        dispatch(closeModal());
      });
    },
  });

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.touched.name && formik.errors.name}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="mt-3 d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose}>Отменить</Button>
            <Button type="submit" className="ms-2">Переименовать</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
