import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '../slices/authSlice';

function SignupPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignupSchema = Yup.object({
    username: Yup.string()
      .min(3, t('min3Chars'))
      .max(20, t('max20Chars'))
      .required(t('required')),
    password: Yup.string()
      .min(6, t('min6Chars'))
      .required(t('required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('passwordsMustMatch'))
      .required(t('required')),
  });

  return (
    <div className="container mt-3">
      <h2>{t('registration')}</h2>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={async (values, actions) => {
          try {
            actions.setStatus(null);
            const { username, password } = values;
            const response = await axios.post('/api/v1/signup', { username, password });
            const { token, username: name } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', name);
            dispatch(loginSuccess({ username: name, token }));
            navigate('/');
          } catch (error) {
              actions.setSubmitting(false);
              if (error.response?.status === 409) {
                actions.setFieldError('username', t('userExists'));
              } else {
                actions.setStatus(t('networkErrorToast'));
              }
            }
        }}
      >
        {({ status, isSubmitting }) => (
          <Form>
            {status && <div className="alert alert-danger">{status}</div>}
            <div className="mb-3">
              <label htmlFor="username">{t('username')}</label>
              <Field name="username" type="text" className="form-control" data-testid="username-input" />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password">{t('password')}</label>
              <Field name="password" type="password" className="form-control" data-testid="password-input" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
              <Field name="confirmPassword" type="password" className="form-control" data-testid="confirm-password-input" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {t('signup')}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignupPage;
