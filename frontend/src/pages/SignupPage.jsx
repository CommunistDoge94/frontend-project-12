import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('usernameMinError'))
      .max(20, t('usernameMaxError'))
      .required(t('requiredField')),
    password: Yup.string()
      .min(6, t('passwordMinError'))
      .required(t('requiredField')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('passwordMismatch'))
      .required(t('requiredField'))
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { data } = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password
      });

      localStorage.setItem('token', data.token);
      navigate('/', { replace: true });
      
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: t('userExistsError') });
      } else {
        toast.error(t('registrationFailed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{t('registration')}</h2>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                {t('username')}
              </label>
              <Field
                type="text"
                name="username"
                id="username"
                className="form-control"
                data-testid="username-input"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
                data-testid="username-error"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t('password')}
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className="form-control"
                data-testid="password-input"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
                data-testid="password-error"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                {t('confirmPassword')}
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
                data-testid="confirm-password-input"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-danger"
                data-testid="confirm-password-error"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              data-testid="signup-button"
            >
              {isSubmitting ? t('registering') : t('register')}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupPage;
