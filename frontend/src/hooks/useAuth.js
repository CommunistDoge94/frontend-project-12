import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { apiRoutes } from '../api'
import { loginSuccess, logout } from '../slices/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      await axios.get(apiRoutes.getChannels(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      return true
    } catch (err) {
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
