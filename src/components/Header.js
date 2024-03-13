import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthProvider";
import './styles/Header.css';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, logout } = useAuth();
  const { parentId } = useParams(); // Fetch parentId from URL params

  // Function to determine the button's class based on the current path
  const getButtonClass = (buttonPath) => {
    return path === buttonPath ? 'button-selected' : 'button-navbar';
  };

  // Check if the current path is the signup or login page
  const isAuthPage = path === '/signup' || path === '/login';
  if (isAuthPage) {
    return null;
  }

  return (
    <Navbar expand="lg" className="header">
      <Container>
        <Navbar.Brand as={Link} to="/" className="header_title">Dreamify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto NavLinksContainer">
            {!isAuthenticated ? (
              <>
                <div className="button-navbar">
                  <Nav.Link as={Link} to="/" className="text-navbar">Home</Nav.Link>
                </div>
                <div className="button-navbar">
                  <Nav.Link as={Link} to="/login" className="text-navbar">Log In</Nav.Link>
                </div>
                <div className="button-get-started">
                  <Nav.Link as={Link} to="/signup" className="text-get-started">Get Started</Nav.Link>
                </div>
              </>
            ) : (
              <>
                <div className={getButtonClass("/")}>
                  <Nav.Link as={Link} to="/" className="text-navbar">Home</Nav.Link>
                </div>
                <div className={getButtonClass(`/newstory`)}>
                  <Nav.Link as={Link} to={`/newstory`} className="text-navbar">New Story</Nav.Link>
                </div>
                
                <div className={getButtonClass(`/library/parent`)}>
                  <Nav.Link as={Link} to={`/library/parent`} className="text-navbar">Library</Nav.Link>
                </div>
                <div className={getButtonClass(`/myprofile/${parentId}`)}>
                  <Nav.Link as={Link} to={`/myprofile/${parentId}`} className="text-navbar">My Profile</Nav.Link>
                </div>
                <div className="button-navbar" >
                  <Nav.Link as={Link} to="/" onClick={logout} className="text-navbar logout-button">Log Out</Nav.Link>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
