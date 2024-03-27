import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { useAuth } from "../contexts/AuthProvider";
import './styles/Header.css';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, logout } = useAuth(); // Get authentication state and logout function from AuthProvider
  const { parentId } = useParams(); // Get parentId from URL params

  // Function to determine the button's class based on the current path
  // If the current path is the same as the button's path, button will have a selected style
  const getButtonClass = (buttonPath) => path === buttonPath ? 'button-selected' : 'button-navbar';


  // If it's login or signup page, don't render the header
  const isAuthPage = path === '/signup' || path === '/login';
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="header">
      <div className="header-container">
        <Link to="/" className="header-title">
          Dreamify
        </Link>
        <div className="nav-links-container">
          {/* Render different navigation links based on authentication state */}
          {!isAuthenticated ? (
            <>
              <div className="button-navbar">
                <Link to="/" className="text-navbar">
                  Home
                </Link>
              </div>
              <div className="button-navbar">
                <Link to="/login" className="text-navbar">
                  Log In
                </Link>
              </div>
              <div className="button-get-started">
                <Link to="/signup" className="text-white">
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className={getButtonClass("/")}>
                <Link to="/" className="text-navbar">
                  Home
                </Link>
              </div>
              <div className={getButtonClass("/newstory")}>
                <Link to={`/children${parentId}`} className="text-navbar">
                  New Story
                </Link>
              </div>
              <div className={getButtonClass("/library/parent")}>
                <Link to="/library/parent" className="text-navbar">
                  Library
                </Link>
              </div>
              <div className={getButtonClass(`/myprofile/${parentId}`)}>
                <Link to={`/myprofile/${parentId}`} className="text-navbar">
                  My Profile
                </Link>
              </div>
              <div className="button-logout">
                <Link to="/" onClick={logout} className="text-white">
                  Log Out
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}