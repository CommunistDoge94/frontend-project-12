import { useDispatch } from 'react-redux'
import { loginSuccess, logout } from '../slices/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()

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

  return { handleLogin, handleLogout }
}

export default useAuth
