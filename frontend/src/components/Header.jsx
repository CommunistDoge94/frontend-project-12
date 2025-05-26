import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../slices/authSlice.js';
import { useTranslation } from 'react-i18next';

function Header() {
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
    <Navbar bg="light">
      <Container>
        <Navbar.Brand as={NavLink} to="/">{t('brand')}</Navbar.Brand>
        {isLoggedIn && (
          <Button variant="outline-danger" onClick={handleLogout}>
            {t('logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
