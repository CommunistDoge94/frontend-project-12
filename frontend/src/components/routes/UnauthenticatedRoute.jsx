import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const UnauthenticatedRoute = ({ children }) => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}

export default UnauthenticatedRoute
