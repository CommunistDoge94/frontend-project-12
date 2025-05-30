import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ErrorBoundary as RollbarErrorBoundary } from '@rollbar/react'

import Header from './components/Header.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import PrivateRoute from './components/routes/PrivateRoute.jsx'
import UnauthenticatedRoute from './components/routes/UnauthenticatedRoute.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const App = () => {
  return (
    <RollbarErrorBoundary>
      <div className="d-flex flex-column vh-100">
        <Header />
        <div className="flex-grow-1 overflow-hidden">
          <Routes>
            <Route
              path="/signup"
              element={(
                <UnauthenticatedRoute>
                  <SignupPage />
                </UnauthenticatedRoute>
              )}
            />
            <Route
              path="/login"
              element={(
                <UnauthenticatedRoute>
                  <LoginPage />
                </UnauthenticatedRoute>
              )}
            />
            <Route
              path="/"
              element={(
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              )}
            />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </RollbarErrorBoundary>
  )
}

export default App
