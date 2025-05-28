import { Navbar, Container, Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth.js'

const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { handleLogout, isLoggedIn } = useAuth()

  const onLogout = () => {
    handleLogout();
    navigate('/login')
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
