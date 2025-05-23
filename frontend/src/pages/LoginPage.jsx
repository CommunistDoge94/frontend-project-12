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
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Вход в чат</h3>
      
      <div className="mb-4" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
        <h5>Тестовые пользователи:</h5>
        <ul className="list-unstyled">
          {testUsers.map(user => (
            <li key={user.username} style={{ marginBottom: '5px' }}>
              <strong>Логин:</strong> {user.username}, <strong>Пароль:</strong> {user.password}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default LoginPage;
