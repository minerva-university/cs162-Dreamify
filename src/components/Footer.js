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
          <span className="footer-text"><h3>&#xA9;2024 Dreamify</h3></span>
          <span className="footer-text"><h3>dreamify.minerva@gmail.com</h3></span>
        </div>
        <div className="footer-right-group">
          <Link to="/aboutus" className="footer-text">
          <h3>About Us</h3>
          </Link>
          <Link to="/terms" className="footer-text">
          <h3>Terms of Service & Privacy Policy</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
