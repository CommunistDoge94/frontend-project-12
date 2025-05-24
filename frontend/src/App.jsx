import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ChatPage from './pages/ChatPage.jsx';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={(
        <PrivateRoute>
          <ChatPage />
        </PrivateRoute>
      )}
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
