import React from 'react';
import './styles/Footer.css';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const path = location.pathname;
  // Check if the current path is the signup or login page
  const isAuthPage = path === '/signup' || path === '/login';
  if (isAuthPage) {
    return null;
  }

  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="left-group">
          <span className='footer_text' >&#xA9;2024 Dreamify</span>
          <span className='footer_text'>dreamify.minerva@gmail.com</span>
        </div>
        <div className="right-group">
          <a href="#aboutus" className="footer_text">About Us</a>
          <a href="#terms" className="footer_text">Terms of Service & Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
