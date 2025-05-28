import { useSelector } from 'react-redux'

import AddChannelModal from './AddChannelModal'
import RemoveChannelModal from './RemoveChannelModal'
import RenameChannelModal from './RenameChannelModal'

const ModalManager = () => {
  const { type, extra } = useSelector(state => state.modal)

  if (type === 'addChannel') return <AddChannelModal />
  if (type === 'removeChannel') return <RemoveChannelModal />
  if (type === 'renameChannel') {
    return (
      <RenameChannelModal
        channelId={extra.channelId}
        currentName={extra.channelName}
      />
    )
  }

  return null
}

export default ModalManager
