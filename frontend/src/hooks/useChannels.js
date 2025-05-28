import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

import { apiRoutes } from '../api'
import { setActiveChannel } from '../slices/channelsSlice'

const useChannels = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.message || defaultMessage
    toast.error(message)
    console.error(t('errors.api'), error)
  }

  return {
    addChannel: async (name) => {
      try {
        const newChannel = await axios.post(apiRoutes.createChannel(), { name })
        return { success: true, newChannel }
      }
      catch (error) {
        console.error(t('errors.addChannel'))
        handleError(error, t('toast.networkError'))
        return { success: false }
      }
    },

    removeChannel: async (id) => {
      try {
        await axios.delete(apiRoutes.deleteChannel(id))
        return { success: true }
      }
      catch (error) {
        console.error(t('errors.removeChannel'))
        handleError(error, t('toast.channelRemoveError'))
        return { success: false }
      }
    },

    renameChannel: async (id, name) => {
      try {
        await axios.patch(apiRoutes.editChannel(id), { name })
        return { success: true }
      }
      catch (error) {
        console.log(t('errors.renameChannel'))
        handleError(error, t('toast.channelRenameError'))
        return { success: false }
      }
    },
    setActiveChannel: id => dispatch(setActiveChannel(id)),
  }
}

export default useChannels
