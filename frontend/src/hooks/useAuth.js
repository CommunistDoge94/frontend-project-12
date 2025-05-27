import { useDispatch } from 'react-redux'
import axios from 'axios'
import { loginSuccess, logout } from '../slices/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return true
    } catch (error) {
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

  return { checkAuth, handleLogin }
}

export default useAuth
