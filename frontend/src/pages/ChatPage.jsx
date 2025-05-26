import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData } from '../slices/chatSlice';
import { openModal } from '../slices/modalSlice';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket';
import ModalManager from '../components/ModalManager';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chat);

  useSocket();

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchChatData());
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error('Ошибка загрузки каналов:', err);
      }
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(t('toast.loadError'));
  }, [error, t]);

  const handleAddChannel = () => dispatch(openModal({ type: 'addChannel' }));

  if (loading) return <p>{t('status.loading')}</p>;
  if (error) return null;

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
