import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import store from './store'
import i18n from './i18n'
import { Rollbar } from './utils/rollbar'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Rollbar>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    </Rollbar>
  </React.StrictMode>,
)
