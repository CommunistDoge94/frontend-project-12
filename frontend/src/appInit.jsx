import { Provider, useDispatch } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import { Rollbar } from './utils/rollbar.jsx'
import { useEffect } from 'react'

import App from './App.jsx'
import i18n from './i18n.js'
import store from './store/index.js'
import { BrowserRouter } from 'react-router-dom'
import { checkAuth } from './slices/authSlice'

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return children
}

const init = () => {
  return (
    <Rollbar>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
              <App />
              <ToastContainer />
            </I18nextProvider>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </Rollbar>
  )
}

export default init
