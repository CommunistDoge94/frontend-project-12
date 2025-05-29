import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { apiRoutes } from '../api/api'
import { setActiveChannel } from '../slices/channelsSlice'
import { postApi, deleteApi, patchApi } from '../api/createApi'

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
        const newChannel = await postApi(apiRoutes.createChannel(), { name })
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
        await deleteApi(apiRoutes.deleteChannel(id))
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
        await patchApi(apiRoutes.editChannel(id), { name })
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
