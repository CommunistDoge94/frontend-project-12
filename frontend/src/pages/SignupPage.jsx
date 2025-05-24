import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../slices/authSlice';

const SignupSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Не менее 3 символов')
    .max(20, 'Не более 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="container mt-3">
      <h2>Регистрация</h2>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={async (values, actions) => {
          try {
            const { username, password } = values;
            const response = await axios.post('/api/v1/signup', { username, password });
            const { token, username: name } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', name);
            dispatch(loginSuccess({ username: name, token }));
            navigate('/channels/1');
          } catch (error) {
            actions.setSubmitting(false);
            if (error.response && error.response.status === 409) {
              actions.setStatus('Пользователь уже существует');
            } else {
              actions.setStatus('Ошибка регистрации');
            }
          }
        }}
      >
        {({ status, isSubmitting }) => (
          <Form>
            {status && <div className="alert alert-danger">{status}</div>}
            <div className="mb-3">
              <label htmlFor="username">Имя пользователя</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Пароль</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <Field name="confirmPassword" type="password" className="form-control" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Зарегистрироваться
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignupPage;
