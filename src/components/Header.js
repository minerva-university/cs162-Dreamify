import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import styles from './styles/Header.module.css';
//import { useAuth } from "../contexts/AuthProvider";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  /*const { isAuthenticated } = useAuth();*/
  const { parentId } = useParams(); // Fetch parentId from URL params

  // Function to determine the button's class based on the current path
  const getButtonClass = (buttonPath) => {
    return path === buttonPath ? styles.button_selected : styles.button_navbar;
  };


  // Check if the current path is the signup or login page
  const isAuthPage = path === '/signup' || path === '/login';
  if (isAuthPage) {
    return null;
  }

  return (
    <Navbar expand="lg" className={styles.Header}>
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles.Dreamify}>Dreamify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`me-auto ${styles.NavLinksContainer}`}>
            {/* Conditional rendering based on isAuthenticated */}
            {true /* supposed to be isAuthenticated */? (
              // Show "Get Started" if not logged in
              <>
                {/* Home Button */}
                <div className={styles.button_navbar}>
                  <Nav.Link as={Link} to="/" className={styles.text_navbar}>Home</Nav.Link>
                </div>
                <div className={styles.button_navbar}>
                  <Nav.Link as={Link} to="/login" className={styles.text_navbar}>Log In</Nav.Link>
                </div>
                <div className={styles.button_get_started}>
                  <Nav.Link as={Link} to="/signup" className={styles.text_get_started}>Get Started</Nav.Link>
                </div>
              </>
            ) : (
              // Show "New Story", "My Profile", and "Library" if logged in
              <>
                <div className={getButtonClass("/")}>
                  <Nav.Link as={Link} to="/" className={styles.text_navbar}>Home</Nav.Link>
                </div>
                {/* Uncomment below when parentId is defined */}
                {/* <div className={getButtonClass(`/newstory/${childid}`)}>
                  <Nav.Link as={Link} to={`/newstory/${childid}`} className={styles.text_navbar}>New Story</Nav.Link>
                </div> */}
                <div className={getButtonClass(`/myprofile/${parentId}`)}>
                  <Nav.Link as={Link} to={`/myprofile/${parentId}`} className={styles.text_navbar}>My Profile</Nav.Link>
                </div>
                <div className={getButtonClass(`/library/parent`)}>
                  <Nav.Link as={Link} to={`/library/parent`} className={styles.text_navbar}>Library</Nav.Link>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
