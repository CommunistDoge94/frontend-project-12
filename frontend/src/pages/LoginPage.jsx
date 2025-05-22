import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../slices/authSlice';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/v1/login', { username });
      const { token, username: user } = response.data;

      dispatch(loginSuccess({ token, username: user }));
      localStorage.setItem('user', JSON.stringify({ token, username: user }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Вход</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Имя пользователя
          </label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
