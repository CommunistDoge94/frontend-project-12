import React from 'react';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('signupForm.usernameMinError'))
      .max(20, t('signupForm.usernameMaxError'))
      .required(t('signupForm.requiredField')),
    password: Yup.string()
      .min(6, t('signupForm.passwordMinError'))
      .required(t('signupForm.requiredField')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('signupForm.passwordMismatch'))
      .required(t('signupForm.requiredField')),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { data } = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });

      handleLogin(data.token, values.username);
      navigate('/', { replace: true });
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: t('signupForm.userExistsError') });
      } else {
        toast.error(t('registrationFailed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">{t('signupForm.registration')}</h2>
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">{t('signupForm.username')}</label>
                <Field type="text" name="username" id="username" className="form-control" />
                <ErrorMessage name="username" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">{t('signupForm.password')}</label>
                <Field type="password" name="password" id="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">{t('signupForm.confirmPassword')}</label>
                <Field type="password" name="confirmPassword" id="confirmPassword" className="form-control" />
                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
              </div>
              <button type="submit" className="btn btn-success w-100 mb-3" disabled={isSubmitting}>
                {isSubmitting ? t('buttons.registering') : t('buttons.register')}
              </button>
              <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/login')}>
                {t('buttons.cancel')}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;
