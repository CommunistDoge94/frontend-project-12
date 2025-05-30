import { Formik, Field, Form, ErrorMessage } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import useAuth from '../hooks/useAuth'
import { useSignupMutation } from '../api/createApi'

const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('signupForm.error.usernameMinLength'))
      .max(20, t('signupForm.error.usernameMaxLength'))
      .required(t('signupForm.error.required')),
    password: Yup.string()
      .min(6, t('signupForm.error.passwordMinLength'))
      .required(t('signupForm.error.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('signupForm.error.passwordMismatch'))
      .required(t('signupForm.error.required')),
  })

  const [signup] = useSignupMutation()

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await signup({
        username: values.username,
        password: values.password,
      }).unwrap()

      handleLogin(response.token, values.username)
      navigate('/', { replace: true })
    }
    catch (error) {
      if (error?.status === 409) {
        setErrors({ username: t('signupForm.error.userExists') })
      }
      else {
        toast.error(t('toast.registrationFailed'))
      }
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="col-sm-10 col-md-6 col-lg-4">
        <div className="card p-4 shadow-sm">
          <h2 className="text-center mb-4">{t('signupForm.registration')}</h2>
          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('signupForm.username')}
                  </label>
                  <Field type="text" name="username" id="username" className="form-control" />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('signupForm.password')}
                  </label>
                  <Field type="password" name="password" id="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('signupForm.confirmPassword')}
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="form-control"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </div>
                <button type="submit" className="btn btn-success w-100 mb-3" disabled={isSubmitting}>
                  {isSubmitting ? t('signupForm.button.registering') : t('signupForm.button.register')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => navigate('/login')}
                >
                  {t('signupForm.button.cancel')}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
