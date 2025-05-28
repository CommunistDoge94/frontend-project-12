import { useSelector } from 'react-redux'

import ChannelItem from './ChannelItem'
import { selectChannels, selectActiveChannelId } from '../../slices/channelsSlice'
import useChannels from '../../hooks/useChannels'

const ChannelsList = () => {
  const channels = useSelector(selectChannels)
  const activeChannelId = useSelector(selectActiveChannelId)
  const { setActiveChannel } = useChannels()

  return (
    <ul
      className="list-group flex-grow-1 overflow-auto"
      aria-label="Список каналов"
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
