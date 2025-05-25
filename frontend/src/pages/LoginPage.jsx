import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '../slices/authSlice';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authError, setAuthError] = useState(null);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">{t('loginTitle')}</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setAuthError(null);
              const response = await axios.post('/api/v1/login', values);
              const { token, username } = response.data;

              localStorage.setItem('token', token);
              localStorage.setItem('username', username);

              dispatch(loginSuccess({ username, token }));

              navigate('/');
            } catch (err) {
              if (err.response?.status === 401) {
                setAuthError(t('authError'));
              } else {
                setAuthError(t('networkError'));
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">{t('username')}</label>
                <Field id="username" name="username" className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">{t('password')}</label>
                <Field id="password" name="password" type="password" className="form-control" required />
              </div>
              {authError && <div className="alert alert-danger">{authError}</div>}
              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 mb-3">
                {t('login')}
              </button>
              <div className="text-center">
                <Link to="/signup">{t('signup')}</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
