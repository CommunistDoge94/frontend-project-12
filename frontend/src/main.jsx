import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as RollbarProvider } from '@rollbar/react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import store from './store'
import i18n from './i18n'

const rollbarConfig = {
  accessToken: 'df1d77e71336453697b620bf906848d475243c6639f7c8ef05f18f549ed12f91706af7edd7ecc23211e8c49daffe870f',
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  </React.StrictMode>,
)
