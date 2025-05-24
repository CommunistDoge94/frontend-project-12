import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChannelsPage from './pages/ChatPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/channels/:id"
          element={
            <PrivateRoute>
              <ChannelsPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/channels/1" />} />
      </Routes>
    </>
  );
}

export default App;
