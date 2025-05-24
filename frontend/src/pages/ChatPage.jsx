import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData, addMessage, addChannel } from '../slices/chatSlice';
import { openModal } from '../slices/modalSlice';
import AddChannelModal from '../components/AddChannelModal';
import ModalManager from '../components/ModalManager.jsx';
import socket from '../socket';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { channels = [], messages = [], loading = false, error = null } = useSelector((state) => state.chat) || {};

  const [activeChannelId, setActiveChannelId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  useEffect(() => {
    if (channels.length > 0) {
      const generalChannel = channels.find((ch) => ch.name === 'General') || channels[0];
      setActiveChannelId(generalChannel.id);
    }
  }, [channels]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };
  
    const handleNewChannel = (channel) => {
      dispatch(addChannel(channel));
    };
  
    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
  
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
    };
  }, [dispatch]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    try {
      await axios.post(
        '/api/v1/messages',
        {
          body: messageText,
          channelId: activeChannelId,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessageText('');
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err.message);
    }
  };

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const filteredMessages = messages.filter((msg) => msg.channelId === activeChannelId);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-4 chat-sidebar border-end">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Каналы</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowAddModal(true)}
            >
              +
            </button>
          </div>
          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${channel.id === activeChannelId ? 'active' : ''}`}
                role="button"
                onClick={() => setActiveChannelId(channel.id)}
                style={{ cursor: 'pointer' }}
              >
                <span># {channel.name}</span>
                <Dropdown onClick={(e) => e.stopPropagation()}>
                  <Dropdown.Toggle variant="link" size="sm" className="p-0 text-decoration-none">
                    ⋮
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => dispatch(openModal({
                        type: 'renameChannel',
                        extra: { channelId: channel.id, channelName: channel.name },
                      }))}
                    >
                      Переименовать
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => dispatch(openModal({ type: 'removeChannel', extra: { channelId: channel.id } }))}
                      disabled={channel.removable === false}
                    >
                      Удалить
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-8 d-flex flex-column">
          <h5>Сообщения</h5>
          <div className="chat-messages flex-grow-1 mb-3">
            {filteredMessages.map((message) => (
              <div key={message.id} className="mb-2">
                <b>{message.username}: </b>
                <span>{message.body || message.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Введите сообщение"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </form>
        </div>
      </div>

      <AddChannelModal show={showAddModal} onHide={() => setShowAddModal(false)} />
      <ModalManager />
    </div>
  );
};

export default ChatPage;
