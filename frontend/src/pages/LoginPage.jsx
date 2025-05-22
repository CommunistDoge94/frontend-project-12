import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../slices/authSlice.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await axios.post('/api/v1/login', values);
            const { token, username } = response.data;

            localStorage.setItem('user', JSON.stringify({ token, username }));
            dispatch(loginSuccess({ token, username }));

            navigate('/');
          } catch (error) {
            if (error.response?.status === 401) {
              setErrors({ auth: 'Неверные имя пользователя или пароль' });
            } else {
              setErrors({ auth: 'Ошибка сети. Попробуйте позже.' });
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.auth && (
              <div className="alert alert-danger">{errors.auth}</div>
            )}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <Field name="username" type="text" className="form-control" id="username" />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <Field name="password" type="password" className="form-control" id="password" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
