import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from '../slices/channelsSlice';
import { fetchMessages } from '../slices/messagesSlice';
import { useTranslation } from 'react-i18next';
import useSocket from '../hooks/useSocket';
import ModalManager from '../components/modals/ModalManager';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';
import { openModal } from '../slices/modalSlice';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { loading: channelsLoading, error: channelsError } = useSelector((state) => state.channels);
  const { loading: messagesLoading, error: messagesError } = useSelector((state) => state.messages);

  useSocket();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchChannels()),
          dispatch(fetchMessages())
        ]);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      }
    };
    loadData();
  }, [dispatch]);

  const handleAddChannel = () => dispatch(openModal({ type: 'addChannel' }));

  if (channelsLoading || messagesLoading) return <p>{t('status.loading')}</p>;
  if (channelsError || messagesError) return null;

  return (
    <div className="container-fluid vh-100 p-3">
      <div className="row h-100">
        <div className="col-4 chat-sidebar border-end d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">{t('chatPage.channels')}</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleAddChannel}
            >
              {t('chatPage.plusSign')}
            </button>
          </div>
          <ChannelsList />
        </div>
        <div className="col-8 d-flex flex-column h-100">
          <h5>{t('chatPage.messages')}</h5>
          <MessagesList />
          <MessageForm />
        </div>
      </div>
      <ModalManager />
    </div>
  );
};

export default ChatPage;