import { Navbar, Container, Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useAuth from '../hooks/useAuth.js'

const Header = () => {
  const { t } = useTranslation()
  const { handleLogout } = useAuth()
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

  const onLogout = () => {
    handleLogout()    
  }

  return (
    <Navbar bg="light" fixed="top" className="py-1 shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          {t('header.brand')}
        </Navbar.Brand>
        {isLoggedIn && (
          <Button variant="outline-danger" size="sm" onClick={onLogout}>
            {t('header.logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  )
}

export default Header
