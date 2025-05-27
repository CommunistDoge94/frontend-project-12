import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary as RollbarErrorBoundary } from '@rollbar/react';
import Header from './components/Header.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChannelsPage from './pages/ChatPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <RollbarErrorBoundary>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ChannelsPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/" />} />
      </Routes>
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
    </RollbarErrorBoundary>
  );
}

export default App;