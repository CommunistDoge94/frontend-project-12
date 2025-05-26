import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { closeModal } from '../slices/modalSlice';
import { filterProfanity } from '../utils/profanityFilter';

const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const show = useSelector((state) => state.modal.type === 'addChannel');
  const token = localStorage.getItem('token');

  const Schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('min3Chars'))
      .max(20, t('max20Chars'))
      .test(
        'profanity-check',
        t('profanityError'),
        value => filterProfanity(value) === value
      )
      .required(t('required')),
  });

  return (
    <Modal show={show} onHide={() => dispatch(closeModal())} centered>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const filteredName = filterProfanity(values.name.trim());
            if (!filteredName) {
              toast.error(t('channel.emptyNameError'));
              return;
            }

            await axios.post(
              '/api/v1/channels',
              { name: filteredName },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(t('channelCreated'));
            dispatch(closeModal());
            resetForm();
          } catch (err) {
            toast.error(t('networkErrorToast'));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{t('addChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t('channelName')}</Form.Label>
                <Field name="name">
                  {({ field, meta }) => (
                    <>
                      <Form.Control
                        {...field}
                        type="text"
                        isInvalid={meta.touched && !!meta.error}
                        autoFocus
                        aria-label={t('channelName')}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger mt-2"
                        role="alert"
                      />
                    </>
                  )}
                </Field>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => dispatch(closeModal())}
                aria-label={t('cancel')}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                aria-label={t('confirm')}
              >
                {t('confirm')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;