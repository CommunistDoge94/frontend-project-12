import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChatData,
  addMessage,
  addChannel,
  removeChannel,
  renameChannel,
  setActiveChannel,
} from '../slices/chatSlice';
import { openModal } from '../slices/modalSlice';
import AddChannelModal from '../components/AddChannelModal';
import ModalManager from '../components/ModalManager';
import socket from '../socket';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { channels = [], messages = [], loading, error, activeChannelId } = useSelector((state) => state.chat);
  const [messageText, setMessageText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  useEffect(() => {
    const handleNewMessage = (message) => dispatch(addMessage(message));
    const handleNewChannel = (channel) => dispatch(addChannel(channel));
    const handleRemoveChannel = ({ id }) => dispatch(removeChannel(id));
    const handleRenameChannel = ({ id, name }) => dispatch(renameChannel({ id, name }));

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
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
        { body: messageText, channelId: activeChannelId, username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessageText('');
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const filteredMessages = messages.filter((msg) => msg.channelId === activeChannelId);

  return (
    <div className="container mt-3" style={{ height: 'calc(100vh - 40px)' }}>
      <div className="row h-100">
        <div className="col-4 chat-sidebar border-end" style={{ height: '100%' }}>
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
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  channel.id === activeChannelId ? 'active' : ''
                }`}
                role="button"
                onClick={() => dispatch(setActiveChannel(channel.id))}
                style={{ cursor: 'pointer' }}
              >
                <span># {channel.name}</span>
                {channel.removable && (
                  <Dropdown onClick={(e) => e.stopPropagation()}>
                    <Dropdown.Toggle variant="link" size="sm" className="p-0 text-decoration-none">
                      ⋮
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(
                            openModal({
                              type: 'renameChannel',
                              extra: { channelId: channel.id, channelName: channel.name },
                            })
                          );
                        }}
                      >
                        Переименовать
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(openModal({ type: 'removeChannel', extra: { channelId: channel.id } }));
                        }}
                      >
                        Удалить
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-8 d-flex flex-column" style={{ height: '100%' }}>
          <h5>Сообщения</h5>
          <div className="chat-messages flex-grow-1 overflow-auto mb-3">
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
