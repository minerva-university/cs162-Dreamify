import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './styles/Header.module.css';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;

  const {isAuthenticated} = useAuth();


  // Function to determine the button's class based on the current path
  const getButtonClass = (buttonPath) => {
    return path === buttonPath ? styles.button_selected : styles.button_navbar;
  };

  return (
    <Navbar expand="lg" className={styles.Header}>
      <Container>
        <Navbar.Brand href="/" className={styles.Dreamify}>Dreamify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`me-auto ${styles.NavLinksContainer}`}>
            

             // TODO: fix the isAuthenicated to isLoggedIn

            {/* Conditional rendering based on isLoggedIn */}
            {!isAuthenticated ? (
              // Show "Get Started" if not logged in
              <>
              {/* Home Button */}
              <div className={styles.button_navbar}>
              <Nav.Link href="/" className={styles.text_navbar}>Home</Nav.Link>
            </div>
              <div className={styles.button_navbar}>
                  <Nav.Link href="/login" className={styles.text_navbar}>Log In</Nav.Link>
              </div>

              <div className={styles.button_get_started}>
                <Nav.Link href="/signup" className={styles.text_get_started}>Get Started</Nav.Link>
              </div>
              </>
            ) : (
              // Show "New Story", "My Profile", and "Library" if logged in
              <>

              <div className={getButtonClass("/")}>
                  <Link to="/" className={styles.text_navbar}>Home</Link>
                </div>
                {/* New Story Button */}
                <div className={getButtonClass(`/newstory/${childid}`)}>
                  <Link to={`/newstory/${childid}`} className={styles.text_navbar}>New Story</Link>
                </div>
                {/* My Profile Button */}
                <div className={getButtonClass(`/myprofile/${parentid}`)}>
                  <Link to={`/myprofile/${parentid}`} className={styles.text_navbar}>My Profile</Link>
                </div>
                {/* Library Button */}
                <div className={getButtonClass(`/library/parent/${parentid}`)}>
                  <Link to={`/library/parent/${parentid}`} className={styles.text_navbar}>Library</Link>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}