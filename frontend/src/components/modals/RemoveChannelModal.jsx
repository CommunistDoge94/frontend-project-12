import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import axios from 'axios'

import { removeChannel } from '../../slices/channelsSlice'
import { removeMessagesByChannelId } from '../../slices/messagesSlice'
import useModal from '../../hooks/useModal'
import { apiRoutes } from '../../api/api'
import { getToken, getAuthHeader } from '../../utils/auth'
import { deleteApi } from '../../api/createApi'

const RemoveChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const { channelId } = useSelector(state => state.modal.extra || {})

  const handleClose = () => {
    closeModal()
  }

  const handleRemove = async () => {
  const token = getToken()

  try {
    await deleteApi(apiRoutes.deleteChannel(channelId), getAuthHeader(token))

    dispatch(removeChannel(channelId))
    dispatch(removeMessagesByChannelId(channelId))
    toast.success(t('toast.channelDeleted'))
    closeModal()
  }
  catch (err) {
    console.error(t('errors.removeChannel'), err)
    toast.error(t('toast.networkError'))
  }
}

  return (
    <Modal show centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('modal.removeConfirmation')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('modal.button.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          {t('modal.button.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
