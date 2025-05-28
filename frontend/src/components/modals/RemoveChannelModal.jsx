import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import axios from 'axios'
import { removeChannel } from '../../slices/channelsSlice'
import { removeMessagesByChannelId } from '../../slices/messagesSlice'
import useModal from '../../hooks/useModal'
import { apiRoutes } from '../../api'

const RemoveChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const { channelId } = useSelector(state => state.modal.extra || {})

  const [error, setError] = useState('')

  const handleClose = () => {
    setError('')
    closeModal()
  }

  const handleRemove = async () => {
    setError('')
    const token = localStorage.getItem('token')

    try {
      await axios.delete(apiRoutes.deleteChannel(channelId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch(removeChannel(channelId))
      dispatch(removeMessagesByChannelId(channelId))
      toast.success(t('toast.channelDeleted'))
      closeModal()
    } catch (err) {
      const message = err.response?.data?.message || error || t('toast.networkError')
      setError(message)
      toast.error(message)
    }
  }

  return (
    <Modal show centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('chatPage.removeConfirmation')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          {t('buttons.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
