import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { fetchMessages, selectMessages } from '../slices/messagesSlice'
import { fetchChannels, selectChannels, selectActiveChannelId } from '../slices/channelsSlice'
import ModalManager from '../components/modals/ModalManager'
import ChannelsList from '../components/channels/ChannelsList'
import MessagesList from '../components/messages/MessagesList'
import MessageForm from '../components/messages/MessageForm'
import { openModal } from '../slices/modalSlice'

const ChatPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { loading: channelsLoading, error: channelsError } = useSelector(state => state.channels)
  const { loading: messagesLoading, error: messagesError } = useSelector(state => state.messages)
  const channels = useSelector(selectChannels)
  const activeChannelId = useSelector(selectActiveChannelId)
  const messages = useSelector(selectMessages)

  const activeChannel = useMemo(
    () => channels.find(ch => ch.id === activeChannelId),
    [channels, activeChannelId],
  )

  const messagesCount = useMemo(
    () => messages.filter(msg => msg.channelId === activeChannelId).length,
    [messages, activeChannelId],
  )

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  const handleAddChannel = () => dispatch(openModal({ type: 'addChannel' }))

  if (channelsLoading || messagesLoading) return <p>{t('inStatus.loadingData')}</p>
  if (channelsError || messagesError) return null

  return (
    <div className="container-fluid bg-secondary-subtle h-100 pt-5">
      <div className="row h-100 gx-0 justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 h-100">
          <div className="card h-100">
            <div className="row h-100 gx-0">
              <div className="col-4 d-flex flex-column border-end h-100">
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                  <h5 className="mb-0">{t('chatPage.channels')}</h5>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleAddChannel}
                  >
                    {t('chatPage.plusSign')}
                  </button>
                </div>
                <div className="flex-grow-1 overflow-auto bg-light px-2">
                  <ChannelsList />
                </div>
              </div>
              <div className="col-8 d-flex flex-column h-100">
                <div className="border-bottom bg-light px-3 py-2">
                  <h5 className="mb-0">
                    #
                    {activeChannel?.name}
                  </h5>
                  <span className="text-muted small">
                    {t('chatPage.messagesCount', { count: messagesCount })}
                  </span>
                </div>
                <div className="flex-grow-1 overflow-auto px-3 py-2">
                  <MessagesList />
                </div>
                <div className="border-top px-3 py-2">
                  <MessageForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalManager />
    </div>
  )
}

export default ChatPage
