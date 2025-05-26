import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get('/api/v1/channels', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(true);
      } catch (err) {
        localStorage.removeItem('token');
        setIsValid(false);
      }
    };

    if (token) verifyToken();
    else setIsValid(false);
  }, [token]);

  if (isValid === null) return <div>Loading...</div>;
  return isValid ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
