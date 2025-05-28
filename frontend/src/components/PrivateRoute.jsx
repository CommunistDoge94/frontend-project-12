import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { apiRoutes } from '../api'
import { fetchChannels } from '../slices/channelsSlice'
import { fetchMessages } from '../slices/messagesSlice'

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null)
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()

  useEffect(() => {
    const verifyAndLoad = async () => {
      if (!token) {
        setIsValid(false)
        return
      }

      try {
        await axios.get(apiRoutes.getChannels(), {
          headers: { Authorization: `Bearer ${token}` },
        })

        await Promise.all([
          dispatch(fetchChannels()),
          dispatch(fetchMessages()),
        ])

        setIsValid(true)
      } catch (err) {
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
