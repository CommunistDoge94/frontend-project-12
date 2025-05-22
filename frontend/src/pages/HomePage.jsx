import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchInitialData,
  initializeSocket,
  sendMessage,
  setCurrentChannelId,
  closeSocket,
} from '../slices/chatSlice';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const {
    channels,
    messages,
    loading,
    error,
    currentChannelId,
    socketConnected,
  } = useSelector((state) => state.chat);

  const [messageBody, setMessageBody] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchInitialData())
        .unwrap()
        .then((data) => {
          if (!data.currentChannelId && data.channels.length > 0) {
            const generalChannel = data.channels.find(
              (ch) => ch.name.toLowerCase() === 'general'
            );
            const channelId = generalChannel ? generalChannel.id : data.channels[0].id;
            dispatch(setCurrentChannelId(channelId));
          }
          dispatch(initializeSocket());
        });
    }

    return () => {
      dispatch(closeSocket());
    };
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChannelId]);

  const filteredMessages = messages.filter(
    (msg) => msg.channelId === currentChannelId
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    try {
      await dispatch(
        sendMessage({ body: messageBody, channelId: currentChannelId })
      ).unwrap();
      setMessageBody('');
    } catch (err) {
    }
  };

  const handleChannelSelect = (id) => {
    dispatch(setCurrentChannelId(id));
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className="container">
    <div className="channels">
      <h5>Каналы</h5>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`channel-item ${channel.id === currentChannelId ? 'active' : ''}`}
          onClick={() => handleChannelSelect(channel.id)}
        >
          {channel.name}
        </div>
      ))}
    </div>

    <div className="chat">
      <div className="chat-header">
        <span>Канал: {channels.find((ch) => ch.id === currentChannelId)?.name || ''}</span>
        {!socketConnected && <span className="status-offline">Оффлайн</span>}
      </div>

      <div className="messages-list" id="messages-list">
        {filteredMessages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.username}:</strong> {message.body}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="input-group">
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          disabled={!socketConnected}
        />
        <button type="submit" disabled={!socketConnected || !messageBody.trim()}>
          Отправить
        </button>
      </form>
    </div>
  </div>
  );
};

export default HomePage;
