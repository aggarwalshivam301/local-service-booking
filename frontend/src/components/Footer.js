import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-square-footer">S</div>
              <span className="logo-text-footer">ServiceHub</span>
            </div>
            <p className="footer-description">
              Connect with local service providers for all your needs. 
              Professional, reliable, and trusted services at your fingertips.
            </p>
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FiGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FiLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FiTwitter />
              </a>
              <a href="mailto:contact@servicehub.com" className="social-link">
                <FiMail />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">For Customers</h3>
            <ul className="footer-links">
              <li><Link to="/services">Browse Services</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">For Providers</h3>
            <ul className="footer-links">
              <li><Link to="/register">Become a Provider</Link></li>
              <li><Link to="/my-services">Manage Services</Link></li>
              <li><Link to="/provider-guide">Provider Guide</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} ServiceHub. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
