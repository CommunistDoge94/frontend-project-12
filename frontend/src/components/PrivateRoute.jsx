import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const PrivateRoute = ({ children }) => {
  const { t } = useTranslation()
  const { isLoggedIn, initialized } = useSelector(state => state.auth)

  if (!initialized) {
    return <div>{t('inStatus.loading')}</div>
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default PrivateRoute