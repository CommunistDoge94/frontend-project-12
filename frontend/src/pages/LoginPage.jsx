import React from 'react';
import { Formik, Form, Field } from 'formik';

const LoginPage = () => (
  <div className="container mt-5">
    <h1>Login</h1>
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values) => {
        console.log('Form values:', values); // Пока только лог
      }}
    >
      <Form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <Field name="username" type="text" className="form-control" id="username" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <Field name="password" type="password" className="form-control" id="password" />
        </div>

        <button type="submit" className="btn btn-primary">Login</button>
      </Form>
    </Formik>
  </div>
);

export default LoginPage;
