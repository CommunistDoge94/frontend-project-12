import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout as logoutAction } from '../slices/authSlice.js';

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <Navbar bg="light" fixed="top" className="py-1 shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/">{t('buttons.brand')}</Navbar.Brand>
        {isLoggedIn && (
          <Button variant="outline-danger" size="sm" onClick={handleLogout}>
            {t('buttons.logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
