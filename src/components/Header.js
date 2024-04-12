import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import "./styles/Header.css";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, logout } = useAuth(); // Get authentication state and logout function from AuthProvider

  // Function to determine the button's class based on the current path
  // If the current path is the same as the button's path, button will have a selected style
  const getButtonClass = (buttonPath) =>
    path === buttonPath ? "header-button-selected" : "header-button-navbar";

  // If it's login or signup page, don't render the header
  const isAuthPage = path === "/signup" || path === "/login";
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="header">
      <div className="header-container">
        <Link to="/" className="header-title">
        <h3>Dreamify</h3>
        </Link>
        <div className="header-nav-links-container">
          {/* Render different navigation links based on authentication state */}
          {!isAuthenticated ? (
            <>
              <Link to="/" className="header-button-navbar header-text-navbar">
                <p>
                Home
                </p>
              </Link>
              <Link
                to="/login"
                className="header-button-navbar header-text-navbar"
              >
                <p>Log In</p>
             
              </Link>
              <Link
                to="/signup"
                className="header-button-get-started header-text-white"
              >
                <p>Get Started</p>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`${getButtonClass("/")} header-text-navbar`}
              >
                <p>Home</p>
              </Link>
              <Link
                to="/children"
                className={`${getButtonClass("/children")} header-text-navbar`}
              >
                <p> New Story</p>
               
              </Link>
              <Link
                to="/library"
                className={`${getButtonClass(
                  "/library"
                )} header-text-navbar`}
              >
                <p>Library</p>
              </Link>
              <Link
                to={`/myprofile`}
                className={`${getButtonClass(
                  `/myprofile`
                )} header-text-navbar`}
              >
                <p>My Profile</p>
              </Link>
              <Link
                to="/"
                onClick={logout}
                className="header-button-logout header-text-white"
              >
                <p>Log Out</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
