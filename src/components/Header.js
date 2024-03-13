import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import styles from './styles/Header.module.css';

export default function Header({ isLoggedIn }) {
  const location = useLocation();
  const path = location.pathname;

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
            

            {/* Conditional rendering based on isLoggedIn */}
            {!isLoggedIn ? (
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
              <Nav.Link href="/" className={styles.text_navbar}>Home</Nav.Link>
            </div>
                {/* New Story Button */}
                <div className={getButtonClass("/newstory")}>
                  <Nav.Link href="/newstory" className={styles.text_navbar}>New Story</Nav.Link>
                </div>
                {/* My Profile Button */}
                <div className={getButtonClass("/myprofile")}>
                  <Nav.Link href="/myprofile" className={styles.text_navbar}>My Profile</Nav.Link>
                </div>
                {/* Library Button */}
                <div className={getButtonClass("/library")}>
                  <Nav.Link href="/library" className={styles.text_navbar}>Library</Nav.Link>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}