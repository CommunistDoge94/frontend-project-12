import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import axios from 'axios'
import { toast } from 'react-toastify'

import filterProfanity from '../../utils/profanityFilter'
import { apiRoutes } from '../../api'

const MessageForm = () => {
  const { t } = useTranslation()
  const activeChannelId = useSelector(state => state.channels.activeChannelId)
  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const rawText = values.messageText.trim()

    if (!rawText) {
      toast.error(t('toast.emptyMessage'))
      setSubmitting(false)
      return
    }

    const filteredText = filterProfanity(rawText)

    try {
      await axios.post(
        apiRoutes.createMessage(),
        {
          body: filteredText,
          channelId: activeChannelId,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      resetForm()
    }
    catch (err) {
      toast.error(t('toast.networkError'))
      console.error(t('errors.messageSend'), err)
    }
    finally {
      setSubmitting(false)
    }
  }

  const renderForm = ({ isSubmitting }) => (
    <Form className="d-flex">
      <Field
        type="text"
        name="messageText"
        className="form-control me-2"
        placeholder={t('message.input')}
        autoComplete="off"
        aria-label="Новое сообщение"
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {t('message.button.send')}
      </button>
    </Form>
  )

  return (
    <Formik
      initialValues={{ messageText: '' }}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  )
}

export default MessageForm