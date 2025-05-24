import React, { useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannel } from '../slices/chatSlice';

const AddChannelModal = ({ show, onHide }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.chat.channels);

  useEffect(() => {
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [show]);

  const channelNames = channels.map((c) => c.name);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(channelNames, 'Канал с таким именем уже существует')
      .required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/v1/channels', { name: values.name }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newChannel = response.data;
      dispatch(setActiveChannel(newChannel.id)); // выберем его активным
      onHide();
      resetForm();
    } catch (e) {
      console.error('Ошибка добавления канала:', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Имя канала</Form.Label>
                <Field
                  name="name"
                  innerRef={inputRef}
                  className="form-control"
                  autoComplete="off"
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="name" />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                Добавить
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
