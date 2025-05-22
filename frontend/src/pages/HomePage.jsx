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
    <div className="container mt-4">
      <div className="row">
        <div className="col-4">
          <h5>Каналы</h5>
          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item ${
                  channel.id === currentChannelId ? 'active' : ''
                }`}
                onClick={() => handleChannelSelect(channel.id)}
                style={{ cursor: 'pointer' }}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-8 d-flex flex-column">
          <h5>
            Сообщения{' '}
            {!socketConnected && (
              <span className="text-danger"> (Оффлайн)</span>
            )}
          </h5>
          <ul
            className="list-group mb-3 flex-grow-1 overflow-auto"
            style={{ maxHeight: '400px' }}
          >
            {filteredMessages.map((message) => (
              <li key={message.id} className="list-group-item">
                <strong>{message.username}: </strong>
                {message.body}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
          <form onSubmit={handleSendMessage} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Введите сообщение..."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              disabled={!socketConnected}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!socketConnected || !messageBody.trim()}
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
