import React from "react";
import { useLocation, Link} from "react-router-dom";

import "./styles/Footer.css";

export default function Footer() {
  const location = useLocation();
  const path = location.pathname;

  // If it's login or signup page, don't render the footer
  const isAuthPage = path === "/signup" || path === "/login";
  if (isAuthPage) {
    return null;
  }

  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-left-group">
          <span className="footer-text"><p>&#xA9;2024 Dreamify</p></span>
          <span className="footer-text"><p>dreamify.minerva@gmail.com</p></span>
        </div>
        <div className="footer-right-group">
          <Link to="/aboutus" className="footer-text">
          <p>About Us</p>
          </Link>
          <Link to="/terms" className="footer-text">
          <p>Terms of Service & Privacy Policy</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
