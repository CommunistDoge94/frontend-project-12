import { useDispatch } from 'react-redux'

import { getApi } from '../api/createApi'
import { apiRoutes } from '../api/api'
import { loginSuccess, logout } from '../slices/authSlice'
import { getAuthHeader } from '../utils/auth'

const useAuth = () => {
  const dispatch = useDispatch()

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      await getApi(apiRoutes.getChannels(), getAuthHeader(token))

      return true
    }
    catch (err) {
      console.error(err)
      localStorage.removeItem('token')
      dispatch(logout())
      return false
    }
  }

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    dispatch(loginSuccess({ username, token }))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    dispatch(logout())
  }

  return { checkAuth, handleLogin, handleLogout }
}

export default useAuth
