import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { apiRoutes } from '../api'
import { fetchChannels } from '../slices/channelsSlice'
import { fetchMessages } from '../slices/messagesSlice'
import { getAuthHeader, getToken } from '../utils/auth'

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null)
  const { t } = useTranslation()
  const token = getToken()
  const dispatch = useDispatch()

  useEffect(() => {
    const verifyAndLoad = async () => {
      if (!token) {
        setIsValid(false)
        return
      }

      try {
        await axios.get(apiRoutes.getChannels(), {
          headers: getAuthHeader(token),
        })

        await dispatch(fetchChannels()).unwrap()
        await dispatch(fetchMessages()).unwrap()

        setIsValid(true)
      }
      catch (err) {
        console.error(t('errors.verify'), err)
        localStorage.removeItem('token')
        setIsValid(false)
      }
    }

    verifyAndLoad()
  }, [token, dispatch])

  if (isValid === null) return <div>Loading...</div>
  return isValid ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
