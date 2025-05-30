import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik'

import { renameChannel as renameChannelAction } from '../../slices/channelsSlice'
import filterProfanity from '../../utils/profanityFilter'
import useModal from '../../hooks/useModal'
import { useEditChannelMutation } from '../../api/createApi'

const RenameChannelModal = ({ channelId, currentName }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('modal.error.channelNameLength'))
      .max(20, t('modal.error.channelNameLength'))
      .required(t('modal.error.required')),
  })

  const [editChannel] = useEditChannelMutation()

  const handleSubmit = async ({ name }, { setSubmitting, setFieldError }) => {
    const filteredName = filterProfanity(name.trim())

    if (!filteredName) {
      setFieldError('name', t('modal.error.emptyChannelName'))
      setSubmitting(false)
      return
    }

    try {
      await editChannel({ id: channelId, name: filteredName }).unwrap()

      toast.success(t('toast.channelRenamed'))
      dispatch(renameChannelAction({ id: channelId, name: filteredName }))
      closeModal()
    }
    catch (err) {
      console.error(t('errors.renameChannel'), err)
      toast.error(t('toast.networkError'))
    }
    finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    closeModal()
  }

  return (
    <Modal show={!!channelId} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: currentName }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, touched, errors }) => (
          <FormikForm>
            <Modal.Body>
              <Form.Group controlId="channelName">
                <Field
                  name="name"
                  as={Form.Control}
                  aria-label="Имя канала"
                  autoFocus
                  isInvalid={touched.name && !!errors.name}
                />
                <Form.Control.Feedback type="invalid" className="mt-2">
                  <ErrorMessage name="name" />
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                {t('modal.button.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {t('modal.button.rename')}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
