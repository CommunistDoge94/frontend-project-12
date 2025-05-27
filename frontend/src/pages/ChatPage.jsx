import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { fetchChannels } from '../slices/channelsSlice'
import { fetchMessages } from '../slices/messagesSlice'
import useSocket from '../hooks/useSocket'
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

  useSocket()

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  const handleAddChannel = () => dispatch(openModal({ type: 'addChannel' }))

  if (channelsLoading || messagesLoading) return <p>{t('status.loading')}</p>
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
                <div className="flex-grow-1 overflow-auto px-2">
                  <ChannelsList />
                </div>
              </div>
              <div className="col-8 d-flex flex-column h-100">
                <div className="border-bottom px-3 py-2">
                  <h5 className="mb-0">{t('chatPage.messages')}</h5>
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
