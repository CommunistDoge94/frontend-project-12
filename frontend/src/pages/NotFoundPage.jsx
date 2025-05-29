import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <h1 className="display-4">404</h1>
      <p className="lead">{t('notFoundPage.notFound')}</p>
      <Link to="/" className="btn btn-outline-primary mt-3">{t('notFoundPage.goHome')}</Link>
    </div>
  )
}

export default NotFoundPage
