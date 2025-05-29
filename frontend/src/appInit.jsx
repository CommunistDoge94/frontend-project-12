import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import { Rollbar } from './utils/rollbar.jsx'

import App from './App.jsx'
import i18n from './i18n.js'
import store from './store/index.js'
import { BrowserRouter } from 'react-router-dom'

const init = () => {
  return (
    <Rollbar>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <App />
            <ToastContainer />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </Rollbar>
  )
}

export default init