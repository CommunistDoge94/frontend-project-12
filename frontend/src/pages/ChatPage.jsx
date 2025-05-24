import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData, addMessage } from '../slices/chatSlice';
import socket from '../socket';
import axios from 'axios';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { channels = [], messages = [], loading = false, error = null } = useSelector((state) => state.chat) || {};

  const [activeChannelId, setActiveChannelId] = useState(null);
  const [messageText, setMessageText] = useState('');

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

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
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
        <div className="col-4 border-end" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <h5>Каналы</h5>
          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item ${channel.id === activeChannelId ? 'active' : ''}`}
                role="button"
                onClick={() => setActiveChannelId(channel.id)}
                style={{ cursor: 'pointer' }}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-8 d-flex flex-column">
          <h5>Сообщения</h5>
          <div
            style={{
              maxHeight: '70vh',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '10px',
              flexGrow: 1,
            }}
          >
            {filteredMessages.map((message) => (
              <div key={message.id} className="mb-2">
                <b>{message.username}: </b>
                <span>{message.body || message.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="mt-3 d-flex">
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
    </div>
  );
};

export default ChatPage;
