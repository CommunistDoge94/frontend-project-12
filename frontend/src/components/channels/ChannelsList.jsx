import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import ChannelItem from './ChannelItem'
import { selectChannels, selectActiveChannelId } from '../../slices/channelsSlice'
import useChannels from '../../hooks/useChannels'

const ChannelsList = () => {
  const channels = useSelector(selectChannels)
  const activeChannelId = useSelector(selectActiveChannelId)
  const { setActiveChannel } = useChannels()
  const { t } = useTranslation()

  return (
    <ul
      className="list-group flex-grow-1 overflow-auto"
      aria-label={t('channel.list')}
    >
      {channels.map(channel => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isActive={channel.id === activeChannelId}
          onClick={() => setActiveChannel(channel.id)}
        />
      ))}
    </ul>
  )
}

export default ChannelsList
