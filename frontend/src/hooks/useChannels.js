import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { setActiveChannel } from '../slices/channelsSlice'
import { useCreateChannelMutation, useDeleteChannelMutation, useEditChannelMutation } from '../api/createApi'

const useChannels = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleError = (error, defaultMessage) => {
    const message = error?.data?.message || defaultMessage
    toast.error(message)
    console.error(t('errors.api'), error)
  }

  const [createChannelMutation] = useCreateChannelMutation()
  const [deleteChannelMutation] = useDeleteChannelMutation()
  const [editChannelMutation] = useEditChannelMutation()

  return {
    addChannel: async (name) => {
      try {
        const newChannel = await createChannelMutation({ name }).unwrap()
        return { success: true, newChannel }
      } catch (error) {
        console.error(t('errors.addChannel'))
        handleError(error, t('toast.networkError'))
        return { success: false }
      }
    },

    removeChannel: async (id) => {
      try {
        await deleteChannelMutation(id).unwrap()
        return { success: true }
      } catch (error) {
        console.error(t('errors.removeChannel'))
        handleError(error, t('toast.channelRemoveError'))
        return { success: false }
      }
    },

    renameChannel: async (id, name) => {
      try {
        await editChannelMutation({ id, name }).unwrap()
        return { success: true }
      } catch (error) {
        console.log(t('errors.renameChannel'))
        handleError(error, t('toast.channelRenameError'))
        return { success: false }
      }
    },

    setActiveChannel: (id) => dispatch(setActiveChannel(id)),
  }
}

export default useChannels
