import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { filterProfanity } from '../../utils/profanityFilter';

const MessageForm = () => {
  const { t } = useTranslation();
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const token = localStorage.getItem('token');

  return (
    <Formik
      initialValues={{ messageText: '' }}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        const rawText = values.messageText.trim();
        
        if (!rawText) {
          toast.error(t('message.emptyError'));
          setSubmitting(false);
          return;
        }

        const filteredText = filterProfanity(rawText);
        
        try {
          await axios.post(
            '/api/v1/messages',
            { 
              body: filteredText,
              channelId: activeChannelId,
              username: localStorage.getItem('username')
            },
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          resetForm();
        } catch (err) {
          toast.error(t('toast.networkError'));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="d-flex">
          <Field
            type="text"
            name="messageText"
            className="form-control me-2"
            placeholder={t('chatPage.enterMessage')}
            autoComplete="off"
            aria-label="Новое сообщение"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {t('buttons.send')}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default MessageForm;