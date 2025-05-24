import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Вход в чат</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setAuthError(null);
              const response = await axios.post('/api/v1/login', values);
              const { token, username } = response.data;
          
              localStorage.setItem('token', token);
              localStorage.setItem('username', username);
          
              navigate('/');
            } catch (err) {
              if (err.response?.status === 401) {
                setAuthError('Неверные имя пользователя или пароль');
              } else {
                setAuthError('Ошибка сети. Попробуйте позже.');
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Имя пользователя</label>
                <Field id="username" name="username" className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Пароль</label>
                <Field id="password" name="password" type="password" className="form-control" />
              </div>
              {authError && <div className="alert alert-danger">{authError}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
