import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import useModal from '../../hooks/useModal'
import filterProfanity from '../../utils/profanityFilter'
import { addChannel } from '../../slices/channelsSlice'
import { useCreateChannelMutation } from '../../api/createApi'

const AddChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const show = useSelector(state => state.modal.type === 'addChannel')
  const channels = useSelector(state => state.channels.items)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(3, t('modal.error.channelNameLength'))
      .max(20, t('modal.error.channelNameLength'))
      .required(t('modal.error.required')),
  })

  const [createChannel] = useCreateChannelMutation()

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const rawName = values.name.trim()
    const filteredName = filterProfanity(rawName)

    const exists = channels.some(
      ch => ch.name.toLowerCase() === filteredName.toLowerCase(),
    )

    if (exists) {
      toast.error(t('toast.channelExists'))
      setSubmitting(false)
      return
    }

    try {
      const result = await createChannel({ name: filteredName }).unwrap()

      dispatch(
        addChannel({
          id: Number(result.id),
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
      console.error(t('errors.channelCreation'), err)
      if (err?.status === 409) {
        toast.error(t('toast.channelExists'))
      }
      else {
        toast.error(t('toast.networkError'))
      }
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{t('modal.addChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="channelName">
                <Form.Label>{t('modal.channelName')}</Form.Label>
                <Field name="name">
                  {({ field, meta }) => (
                    <>
                      <Form.Control
                        {...field}
                        type="text"
                        isInvalid={meta.touched && !!meta.error}
                        autoFocus
                        aria-label={t('modal.channelName')}
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
                aria-label={t('modal.button.cancel')}
              >
                {t('modal.button.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                aria-label={t('modal.button.confirm')}
              >
                {t('modal.button.confirm')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal
