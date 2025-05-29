import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useAuth from '../hooks/useAuth'
import { apiRoutes } from '../api/api'
import { postApi } from '../api/createApi'

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState(null)
  const { handleLogin } = useAuth()

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="col-sm-10 col-md-6 col-lg-4">

        <div className="card p-4 shadow-sm">
          <h2 className="text-center mb-4">{t('loginForm.loginTitle')}</h2>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setAuthError(null)
                const response = await postApi(apiRoutes.login(), values)

                const { token, username } = response
                handleLogin(token, username)
                navigate('/')
              }
              catch (err) {
                if (err.response?.status === 401) {
                  setAuthError(t('errors.authError'))
                }
                else {
                  setAuthError(t('toast.networkError'))
                }
              }
              finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">{t('loginForm.username')}</label>
                  <Field id="username" name="username" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">{t('loginForm.password')}</label>
                  <Field id="password" name="password" type="password" className="form-control" required />
                </div>
                {authError && <div className="alert alert-danger">{authError}</div>}
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 mb-3">
                  {t('loginForm.button.login')}
                </button>
                <div className="text-center">
                  <Link to="/signup">{t('loginForm.button.signup')}</Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
