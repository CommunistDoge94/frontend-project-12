import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInitialData } from '../slices/chatSlice';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { channels, messages, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchInitialData());
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-4">
          <h5>Каналы</h5>
          <ul className="list-group">
            {Array.isArray(channels) && channels.map((channel) => (
              <li key={channel.id} className="list-group-item">
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-8">
          <h5>Сообщения</h5>
          <ul className="list-group">
            {Array.isArray(messages) && messages.map((message) => (
              <li key={message.id} className="list-group-item">
                <strong>{message.username}: </strong>
                {message.body}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
