import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { apiRoutes } from '../../api'
import useModal from '../../hooks/useModal'
import filterProfanity from '../../utils/profanityFilter'
import { addChannel } from '../../slices/channelsSlice'

const AddChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const show = useSelector(state => state.modal.type === 'addChannel')
  const channels = useSelector(state => state.channels.items)
  const token = localStorage.getItem('token')

  const Schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('chatPage.chatNameLengthError'))
      .max(20, t('chatPage.chatNameLengthError'))
      .required(t('chatPage.required')),
  })

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const rawName = values.name.trim()
            if (!rawName) {
              toast.error(t('toast.channelEmptyNameError'))
              return
            }

            const filteredName = filterProfanity(rawName)
            const exists = channels.some(
              ch => ch.name.toLowerCase() === filteredName.toLowerCase(),
            )

            if (exists) {
              toast.error(t('toast.channelExists'))
              return
            }

            const response = await axios.post(
              apiRoutes.createChannel(),
              { name: filteredName },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              },
            )

            dispatch(
              addChannel({
                id: Number(response.data.id),
                name: filteredName,
                removable: true,
                isOwned: true,
              }),
            )

            toast.success(t('toast.channelCreated'))
            closeModal()
            resetForm()
          }
          catch (err) {
            console.error('Channel creation error:', err)
            if (err.response?.status === 409) {
              toast.error(t('toast.channelExists'))
            } 
            else {
              toast.error(t('toast.networkError'))
            }
          }
          finally {
            setSubmitting(false)
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{t('chatPage.addChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t('chatPage.channelName')}</Form.Label>
                <Field name="name">
                  {({ field, meta }) => (
                    <>
                      <Form.Control
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        type="text"
                        isInvalid={meta.touched && !!meta.error}
                        autoFocus
                        aria-label={t('chatPage.channelName')}
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
                onClick={closeModal}
                aria-label={t('buttons.cancel')}
              >
                {t('buttons.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                aria-label={t('buttons.confirm')}
              >
                {t('buttons.confirm')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal
