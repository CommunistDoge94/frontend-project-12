import { Provider, useDispatch } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { Rollbar } from './utils/rollbar.jsx'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import i18n from './i18n.js'
import store from './store/index.js'
import { checkAuth } from './slices/authSlice'
import useSocket from './hooks/useSocket.js'

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return children
}

const SocketProvider = ({ children, socket }) => {
  useSocket(socket)
  return children
}

const init = (socket) => {
  return (
    <Rollbar>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <SocketProvider socket={socket}>
              <I18nextProvider i18n={i18n}>
                <App />
              </I18nextProvider>
            </SocketProvider>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </Rollbar>
  )
}

export default init
