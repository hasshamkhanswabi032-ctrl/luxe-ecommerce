import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/products" className="navbar-logo">LUXE</Link>
      <div className="navbar-links">
        <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>Shop</Link>
        <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
        {isAdmin && <Link to="/admin" className={`nav-link nav-admin ${location.pathname === '/admin' ? 'active' : ''}`}>Admin</Link>}
      </div>
      <div className="navbar-actions">
        <Link to="/cart" className="cart-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>
        <div className="user-menu">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-dropdown">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
