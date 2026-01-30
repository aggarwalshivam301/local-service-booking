import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiBriefcase } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-square">S</div>
          <span className="logo-text">ServiceHub</span>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/services" className="navbar-link" onClick={() => setIsOpen(false)}>
            Browse Services
          </Link>
          
          {user ? (
            <>
              {user.role === 'provider' && (
                <Link to="/my-services" className="navbar-link" onClick={() => setIsOpen(false)}>
                  My Services
                </Link>
              )}
              <Link to="/bookings" className="navbar-link" onClick={() => setIsOpen(false)}>
                My Bookings
              </Link>
            </>
          ) : (
            <Link to="/about" className="navbar-link" onClick={() => setIsOpen(false)}>
              How It Works
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user.displayName?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.displayName}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-email">{user.email}</p>
                    <span className="user-role-badge">{user.role}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FiUser /> Profile
                  </Link>
                  <Link to="/bookings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FiCalendar /> My Bookings
                  </Link>
                  {user.role === 'provider' && (
                    <Link to="/my-services" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <FiBriefcase /> My Services
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
