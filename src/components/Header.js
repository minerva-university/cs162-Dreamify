import React from "react";
import { useLocation, Link, useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthProvider";
import "./styles/Header.css";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, logout } = useAuth(); // Get authentication state and logout function from AuthProvider
  const { parentId } = useParams(); // Get parentId from URL params

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
          Dreamify
        </Link>
        <div className="header-nav-links-container">
          {/* Render different navigation links based on authentication state */}
          {!isAuthenticated ? (
            <>
              <Link to="/" className="header-button-navbar header-text-navbar">
                Home
              </Link>
              <Link
                to="/login"
                className="header-button-navbar header-text-navbar"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="header-button-get-started header-text-white"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`${getButtonClass("/")} header-text-navbar`}
              >
                Home
              </Link>
              <Link
                to="/children"
                className={`${getButtonClass("/children")} header-text-navbar`}
              >
                New Story
              </Link>
              <Link
                to="/library"
                className={`${getButtonClass(
                  "/library"
                )} header-text-navbar`}
              >
                Library
              </Link>
              <Link
                to={`/myprofile`}
                className={`${getButtonClass(
                  `/myprofile/${parentId}`
                )} header-text-navbar`}
              >
                My Profile
              </Link>
              <Link
                to="/"
                onClick={logout}
                className="header-button-logout header-text-white"
              >
                Log Out
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
