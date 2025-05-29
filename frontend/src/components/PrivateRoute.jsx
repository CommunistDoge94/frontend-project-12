import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { fetchChannels } from '../slices/channelsSlice'
import { fetchMessages } from '../slices/messagesSlice'
import useAuth from '../hooks/useAuth'

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { checkAuth } = useAuth()
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

  useEffect(() => {
    const verifyAndLoad = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        setIsValid(false)
        return
      }

      try {
        await dispatch(fetchChannels()).unwrap()
        await dispatch(fetchMessages()).unwrap()
        setIsValid(true)
      }
      catch (err) {
        console.error(t('errors.verify'), err)
        setIsValid(false)
      }
    }

    verifyAndLoad()
  }, [dispatch, isLoggedIn, checkAuth, t])

  if (isValid === null) return <div>{t('inStatus.loading')}</div>
  return isValid ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
