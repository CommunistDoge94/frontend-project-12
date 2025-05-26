import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchChatData } from '../slices/chatSlice';

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAndLoad = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        await axios.get('/api/v1/channels', {
          headers: { Authorization: `Bearer ${token}` }
        });

        await dispatch(fetchChatData()).unwrap();
        
        setIsValid(true);
      } catch (err) {
        localStorage.removeItem('token');
        setIsValid(false);
      }
    };

    verifyAndLoad();
  }, [token, dispatch]);

  if (isValid === null) return <div>Loading...</div>;
  return isValid ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;