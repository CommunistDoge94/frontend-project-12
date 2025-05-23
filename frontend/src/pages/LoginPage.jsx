import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../slices/authSlice';

const testUsers = [
  { username: 'admin', password: 'admin' },
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/v1/login', { username, password });
      const { token, username: user } = response.data;

      dispatch(loginSuccess({ token, username: user }));
      localStorage.setItem('user', JSON.stringify({ token, username: user }));
      navigate('/');
    } catch (err) {
      const status = err.response?.status;
      const message = status === 401 ? 'Неверный логин или пароль' : 'Ошибка входа';
      setError(message);
    }
  };

  return (
    <div className="container login-container">
      <h3 className="login-title">Вход в чат</h3>

      <div className="login-content">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Имя пользователя</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Войти
          </button>
        </form>

        <div className="test-users">
          <h5>Тестовые пользователи:</h5>
          <ul className="list-unstyled">
            {testUsers.map(user => (
              <li key={user.username} style={{ marginBottom: '5px' }}>
                <strong>Логин:</strong> {user.username}, <strong>Пароль:</strong> {user.password}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;