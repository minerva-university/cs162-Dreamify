import React from 'react';
import './styles/Footer.css';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const path = location.pathname;

  // If it's login or signup page, don't render the footer
  const isAuthPage = path === '/signup' || path === '/login';
  if (isAuthPage) {
    return null;
  }

  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-left-group">
          <span className='footer-text' >&#xA9;2024 Dreamify</span>
          <span className='footer-text'>dreamify.minerva@gmail.com</span>
        </div>
        <div className="footer-right-group">
          <a href="/aboutus" className="footer-text">About Us</a>
          <a href="/terms" className="footer-text">Terms of Service & Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
